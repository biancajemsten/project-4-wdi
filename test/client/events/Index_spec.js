/* global describe, it, beforeEach, before, after */

import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import sinon from 'sinon';
import axios from 'axios';
import Promise from 'bluebird';
import _ from 'lodash';

import EventsIndex from '../../../src/components/events/Index';

const users = [{
  username: 'bianca',
  email: 'bianca@test.com',
  password: 'pass',
  passwordConfirmation: 'pass',
  tel: '+46702549294'
},{
  username: 'richard',
  email: 'richard@test.com',
  password: 'pass',
  passwordConfirmation: 'pass',
  tel: '+447762948257'
},{
  username: 'martin',
  email: 'martin@test.com',
  password: 'pass',
  passwordConfirmation: 'pass',
  tel: '+447377103864'
}];

const data = [{
  name: 'Movie Night',
  description: 'Watching films',
  timeSlots: [{
    date: '2018-07-11T12:30:00',
    votes: []
  }, {
    date: '2018-07-13T15:15:00',
    votes: []
  }],
  length: 120,
  address: '4 St Olaf\'s Road',
  location: { lat: 51.4798873, lng: -0.2107483 },
  privacy: 'Public',
  invitees: [users[0], users[2]],
  attendees: [ users[1] ],
  image: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg',
  organizer: [users[1]._id]
}, {
  name: 'Play D&D',
  description: 'Dungeons and dragons, oh my!',
  timeSlots: [{
    date: '2018-07-21T08:30:00',
    votes: []
  }, {
    date: '2018-08-13T13:30:00',
    votes: []
  }],
  length: 300,
  address: 'GA, Relay Building',
  location: { lat: 51.5153002, lng: -0.0746125 },
  privacy: 'Public',
  invitees: [users[0], users[1]],
  attendees: [ users[2] ],
  image: 'https://geekandsundry.com/wp-content/uploads/2016/12/featured-dnd-holiday.png',
  organizer: [users[2]._id]
}];

describe('EventsIndex tests', () => {
  let wrapper;
  let promise;

  before(done => {
    promise = Promise.resolve({ data });
    sinon.stub(axios, 'get').returns(promise);
    done();
  });

  after(done => {
    axios.get.restore();
    done();
  });

  beforeEach(done => {
    wrapper = mount(
      <MemoryRouter>
        <EventsIndex />
      </MemoryRouter>
    );
    done();
  });

  it('should render events', done => {
    promise.then(() => {
      wrapper.update();
      expect(wrapper.find('div.indexList').length).to.eq(1);
      done();
    })
      .catch(done);
  });

  it('should render the correct data', done => {
    promise.then(() => {
      wrapper.update();
      _.orderBy(data, 'name', 'asc').forEach((event, index) => {
        expect(wrapper.find('p').length).to.eq(6);
        expect(wrapper.find('Link').at(index).prop('to')).to.eq(`/events/${event._id}`);
      });
      done();
    });
  });

  it('should re-order the events when the sort dropdown is changed', done => {
    const e = { target: { value: 'name|desc' } };
    promise.then(() => {
      wrapper.find('select').simulate('change', e);
      wrapper.update();
      _.orderBy(data, 'name', 'desc').forEach((event, index) => {
        expect(wrapper.find('div.middleItem').at(index).text()).to.eq(event.address);
        expect(wrapper.find('Link').at(index).prop('to')).to.eq(`/events/${event._id}`);
      });

      done();
    });
  });

  it('should filter the criminals', done => {
    const input = wrapper.find('input');
    promise.then(() => {
      input.simulate('change', { target: { value: 'D&D' } });
      wrapper.update();
      expect(wrapper.find('p').length).to.eq(3);

      input.simulate('change', { target: { value: ' ' } });
      wrapper.update();
      expect(wrapper.find('p').length).to.eq(6);

      input.simulate('change', { target: { value: 'garbage' } });
      wrapper.update();
      expect(wrapper.find('p').length).to.eq(0);

      done();
    });
  });
});
