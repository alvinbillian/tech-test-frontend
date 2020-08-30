import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import Axios from 'axios';

const graphClient = new ApolloClient({
  uri: 'http://localhost:3500/graphql'
});

const axiosClient = Axios.create({
  baseURL: 'http://localhost:3400'
})

export const DataService = {
  //
  //  SAMPLE GraphQL Call
  //
  // getJobsWithSearchTerm: (searchTerm) => {
  //   return graphClient.query({
  //     query: gql`
  //     query ($searchTerm: String){
  //       jobs(name: $searchTerm) {
  //         name,
  //         start,
  //         end,
  //         contact {
  //           id
  //           name
  //         }
  //       }
  //     }
  //     `,
  //     variables: {
  //       searchTerm: searchTerm
  //     }
  //   })
  //     .then(result => result.data)
  //     .then(data => data.jobs)
  // },

  //
  //  SAMPLE Normal call
  //
  // getJobs: () => {
  //   return axiosClient.get('/jobs')
  //     .then(result => result.data.map(x => Object.assign({}, x, { id: x.id + '' })))
  // },

  getJobsWithSearchTerm: (searchTerm) => {
    return graphClient.query({
      query: gql`
      query ($searchTerm: String){
        jobs(name: $searchTerm) {
          name,
          start,
          end,
          contact {
            id
            name
          }
        }
      }
      `,
      variables: {
        searchTerm: searchTerm
      }
    })
      .then(result => result.data.jobs
        .map(job => (
          {
            ...job,
            start: new Date(job.start),
            end: new Date(job.end)
          }
        ))
      )
  },
  
  getJobs: () => {
    return axiosClient.get('/jobs')
      .then(result => result.data
        .map(job => (
          {
            ...job,
            start: new Date(job.start),
            end: new Date(job.end)
          }
        ))
      );
  },

  getActivities: () => {
    return axiosClient.get('/activities')
      .then(result => result.data
        .map(a => (
          {
            ...a,
            start: new Date(a.start),
            end: new Date(a.end)
          }
        ))
      );
  },

  getContacts: () => {
    return axiosClient.get('/contacts')
      .then(result => result.data);
  },

  getResources: () => {
    return Promise.all([
        axiosClient.get('/resources'),
        axiosClient.get('/activityAllocations'),
        axiosClient.get('/jobAllocations')
      ])
      .then(results => results.map(r => r.data))
      .then(([resources, activityAllocations, jobAllocations]) => {
        return resources.map(resource => {
          // Extend resource object with associated activites and jobs allocations
          return {
            ...resource,
            activities: activityAllocations.filter(x => x.resourceId === resource.id),
            jobs: jobAllocations.filter(x => x.resourceId === resource.id),
          };
        });
      });
  },
}