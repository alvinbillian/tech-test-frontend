import React, { useEffect, useState } from 'react';

import { formatDate, formatTime } from '../components/formatter/formatter'
import { SectionGroup } from '../components/section/SectionGroup'
import { SectionPanel } from '../components/section/SectionPanel'

import { DataService } from '../service/DataService'

import './QuestionThree.css'

export const QuestionThree = (props) => {
  let [resources, setResources] = useState([]);
  let [jobs, setJobs] = useState([]);

  useEffect(() => {
    Promise.all([
      DataService.getResources(),
      DataService.getJobs(),
    ])
      .then(([resourcesData, jobsData]) => {
        setResources(resourcesData);
        setJobs(jobsData);
      });
  }, []);

  return (
    <SectionGroup>
      <SectionPanel>
        <div className="header"><h1>Header</h1></div>

        <div className="main-container">
          <div className="job-list">
            {jobs.map(job => {
              const job_resources = resources.filter(r => r.jobs.find(j => j.jobId === job.id));

              return (<div key={job.id} className="job">
                  <div className="job-title">
                    <span className="title-text">{job.name}</span>
                    <span className="job-id">(Job #{job.id})</span>
                  </div>
                  <div className="job-location">{job.location}</div>

                  <div className="job-date">{formatDate(job.start)}</div>
                  <div className="job-time">
                    <span className="start">{formatTime(job.start)}</span>
                    <span> - </span>
                    <span className="end">{formatTime(job.end)}</span>
                  </div>

                  {job_resources.length > 0 && <div className="job-resources-number">{job_resources.length}</div>}
                </div>
              );
            })}
          </div>

          <div className="main-content">
            <div className="placeholder-box"></div>
            <div className="placeholder-box"></div>
            <div className="placeholder-box"></div>
            <div className="placeholder-box"></div>
            <div className="placeholder-box"></div>
            <div className="placeholder-box"></div>
          </div>
        </div>
      </SectionPanel>
    </SectionGroup>
  )
}