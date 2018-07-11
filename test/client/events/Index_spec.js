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

const eventData = [{
  name: 'Movie Night',
  description: 'Watching films',
  timeSlots: [{
    date: '2018-07-25',
    startTime: '2018-07-25'
  }, {
    date: '2018-07-26',
    startTime: '2018-07-26'
  }],
  length: 120,
  address: '4 St Olaf\'s Road',
  location: { lat: 51.4798873, lng: -0.2107483 },
  private: true,
  invitees: [ 'biancajemsten@gmail.com' ],
  image: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg'
}, {
  name: 'Play D&D',
  description: 'Dungeons and dragons, oh my!',
  timeSlots: [{
    date: '2018-08-12',
    startTime: '2018-08-12'
  }, {
    date: '2018-08-19',
    startTime: '2018-08-19'
  }],
  length: 300,
  address: 'GA, Relay Building',
  location: { lat: 51.5153002, lng: -0.0746125 },
  private: false,
  invitees: [ 'herrkoop@gmail.com' ],
  image: 'https://geekandsundry.com/wp-content/uploads/2016/12/featured-dnd-holiday.png'
}];

describe('EventsIndex tests', () => {
  let wrapper;
  let promise;

  before(done => {
    promise = Promise.resolve({ eventData });
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
      console.log(wrapper);
      expect(wrapper.find('table').length).to.eq(1);
      done();
    })
      .catch(done);
  });



});
