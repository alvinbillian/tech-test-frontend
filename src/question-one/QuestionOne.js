import React, { useEffect, useState } from 'react';

import { formatDateTime } from '../components/formatter/formatter'
import { SectionGroup } from '../components/section/SectionGroup'
import { SectionPanel } from '../components/section/SectionPanel'

import { DataService } from '../service/DataService'

import './QuestionOne.css'

export const QuestionOne = (props) => {
  let [isLoading, setIsLoading] = useState(false);
  let [searchResults, setSearchResults] = useState([]);

  let timeout_handle;

  const onSearchChange = e => {
    const search_query = e.target.value;

    if (timeout_handle) {
      clearTimeout(timeout_handle);
    }

    if (!search_query.length) {
      setIsLoading(false);
      setSearchResults([]);
    }

    if (search_query.length >= 3) {
      // Use timeout to wait for user to finish typing before performing search
      timeout_handle = setTimeout(() => {
          setIsLoading(true);
    
          DataService.getJobsWithSearchTerm(search_query)
            .then(jobs => {
              setSearchResults(jobs);
            })
            .finally(() => {
              setIsLoading(false);
            })
      }, 300);
    }
  }

  return (
    <SectionGroup>
      <SectionPanel>
        <input type="text" onChange={onSearchChange} placeholder="Search..." />

        {isLoading &&
          <div className="loading-indicator">Loading...</div>
        }

        {!isLoading && searchResults.length > 0 &&
          <>
            <p>Search results:</p>
            <div className="search-results">
                {searchResults.map((job, index) => 
                  <div key={index} className="search-results-item">
                    <div className="job-title">{job.name}</div>
                    <div className="job-info-item"><div className="label">Start</div> {formatDateTime(job.start)}</div>
                    <div className="job-info-item"><div className="label">End</div> {formatDateTime(job.end)}</div>
                    <div className="job-info-item"><div className="label">Contact</div> {job.contact.name}</div>
                  </div>
                )}
            </div>
          </>
        }
      </SectionPanel>
    </SectionGroup>
  )
}