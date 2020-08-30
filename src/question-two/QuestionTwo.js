import React from 'react';

import { SectionGroup } from '../components/section/SectionGroup'
import { SectionPanel } from '../components/section/SectionPanel'

import { Swimlane, Lane, Card } from '../components/swimlane/Swimlane'
import { DataService } from '../service/DataService'

import './QuestionTwo.css';
import { useEffect, useState } from 'react';

/**
 * Please do not change these dates, the data on the server all fall within the 01/09/2018
 */
const RANGE_START = new Date('2018-09-01T00:00:00Z')
const RANGE_END = new Date('2018-09-01T24:00:00Z')

export const QuestionTwo = (props) => {
  let [resources, setResources] = useState([]);
  let [jobs, setJobs] = useState([]);
  let [activities, setActivities] = useState([]);

  useEffect(() => {
    Promise.all([
      DataService.getResources(),
      DataService.getJobs(),
      DataService.getActivities(),
    ])
      .then(([resourcesData, jobsData, activitiesData]) => {
        setResources(resourcesData);
        setJobs(jobsData);
        setActivities(activitiesData);
      })
  }, []);

  let lanes = resources.map(resource => ({
    title: resource.name,
    cards: [
      ...resource.activities.map(a => {
        const activity = activities.find(x => x.id === a.id);

        return {
          ...activity,
          description: activity && activity.name
        }
      }),

      ...resource.jobs.map(j => {
        const job = jobs.find(x => x.id === x.id);

        return {
          ...job,
          description: job && job.name
        }
      }),
    ]
  }));

  return (
    <SectionGroup>
      <SectionPanel>
        <Swimlane lanes={lanes} start={RANGE_START} end={RANGE_END} />
      </SectionPanel>
    </SectionGroup>
  )
}