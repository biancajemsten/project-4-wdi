/* global describe, it, beforeEach */

import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import EventsForm from '../../../src/components/events/Form';


describe('EventsForm tests', () => {

  let wrapper;

  beforeEach(done => {
    const props = {
      data: {
        name: 'Movie Night',
        description: 'Watching films',
        timeSlots: [{
          date: '2018-07-11T12:30:00',
          votes: []
        }, {
          date: '2018-07-13T15:15:00',
          votes: []
        }],
        selectedTimes: [],
        length: 120,
        address: '4 St Olaf\'s Road',
        location: { lat: 51.4798873, lng: -0.2107483 },
        privacy: 'Private',
        image: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg',
        errors: {}
      }
    };

    // Shallow is for functional components (it does not trigger lifecycle hooks)
    wrapper = shallow(<EventsForm { ...props } />);
    done();
  });

  it('should render a form', done =>{
    expect(wrapper.find('form').length).to.eq(1);
    done();
  });

  it('should render the correct inputs', done => {
    expect(wrapper.find('[name="name"]').length).to.eq(1);
    expect(wrapper.find('[name="description"]').length).to.eq(1);
    expect(wrapper.find('[name="length"]').length).to.eq(1);
    expect(wrapper.find('[name="privacy"]').length).to.eq(1);
    expect(wrapper.find('[name="image"]').length).to.eq(1);
    expect(wrapper.find('button').length).to.eq(2);
    done();
  });


  it('should populate the form', done => {
    expect(wrapper.find({ value: 'Movie Night', name: 'name' }).length).to.eq(1);
    expect(wrapper.find({ value: 'Watching films', name: 'description' }).length).to.eq(1);
    expect(wrapper.find({ value: 120, name: 'length' }).length).to.eq(1);
    expect(wrapper.find({ value: 'Private', name: 'privacy' }).length).to.eq(1);
    expect(wrapper.find({ value: 'http://www.thecumberlandarms.co.uk/wp/wp-content/uploads/2015/04/Cumby-Film-Night-logo-2016-850px-850x478.jpg', name: 'image' }).length).to.eq(1);
    done();
  });


});
