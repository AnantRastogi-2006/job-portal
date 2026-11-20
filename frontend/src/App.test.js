import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as authService from './services/authService';
import * as jobService from './services/jobService';
import * as applicationService from './services/applicationService';

jest.mock('./services/authService');
jest.mock('./services/jobService');
jest.mock('./services/applicationService');

const sampleJob = {
  id: 1,
  title: 'React Developer',
  company: 'Tech Corp',
  salary: '$80k - $120k',
  location: 'New York',
  skills: ['React', 'JavaScript', 'CSS'],
  description: 'Build amazing web apps with React.',
  fullDescription: 'Full description here.',
  jobType: 'Full-time',
  experience: '2+ years',
  postedDate: '2 days ago',
};

const seeker = { id: 5, name: 'Sam', email: 'sam@mail.com', role: 'jobseeker', homePage: 'jobListing' };
const employer = { id: 9, name: 'Acme', email: 'hr@acme.com', role: 'employer', homePage: 'postJob' };

beforeEach(() => {
  authService.me.mockResolvedValue(null);
  jobService.fetchJobs.mockResolvedValue([sampleJob]);
  applicationService.fetchApplications.mockResolvedValue([]);
});

test('guests see the landing page with Login and Sign Up buttons', async () => {
  render(<App />);
  expect(await screen.findByRole('heading', { name: /find a job/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
});

test('Browse Jobs shows the jobs returned by the backend', async () => {
  render(<App />);
  fireEvent.click(await screen.findByRole('button', { name: /browse jobs/i }));
  expect(await screen.findByRole('heading', { name: 'React Developer' })).toBeInTheDocument();
  expect(screen.getByText(/showing 1 of 1 jobs/i)).toBeInTheDocument();
});

test('typing a search that matches nothing shows the empty state', async () => {
  render(<App />);
  fireEvent.click(await screen.findByRole('button', { name: /browse jobs/i }));
  await screen.findByRole('heading', { name: 'React Developer' });
  fireEvent.change(screen.getAllByPlaceholderText(/job title, skills or company/i)[0], {
    target: { value: 'zzzz-no-such-job' },
  });
  expect(screen.getByText(/no jobs match your filters/i)).toBeInTheDocument();
});

test('a job seeker sees My Applications and not Post a Job', async () => {
  authService.me.mockResolvedValue(seeker);
  render(<App />);
  expect(await screen.findByRole('button', { name: /my applications/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /post a job/i })).not.toBeInTheDocument();
});

test('an employer sees Post a Job and not My Applications', async () => {
  authService.me.mockResolvedValue(employer);
  render(<App />);
  expect(await screen.findByRole('button', { name: /post a job/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /my applications/i })).not.toBeInTheDocument();
});

test('a job seeker can apply to a job from the details modal', async () => {
  authService.me.mockResolvedValue(seeker);
  applicationService.applyToJob.mockResolvedValue({});
  window.alert = jest.fn();

  render(<App />);
  fireEvent.click(await screen.findByRole('button', { name: /browse jobs/i }));
  fireEvent.click(await screen.findByRole('button', { name: /view details/i }));
  fireEvent.click(screen.getByRole('button', { name: /apply now/i }));

  await waitFor(() => expect(applicationService.applyToJob).toHaveBeenCalledWith(1));
});

test('an employer account cannot apply (blocked in the UI as well as the server)', async () => {
  authService.me.mockResolvedValue(employer);
  window.alert = jest.fn();

  render(<App />);
  fireEvent.click(await screen.findByRole('button', { name: /browse jobs/i }));
  fireEvent.click(await screen.findByRole('button', { name: /view details/i }));
  fireEvent.click(screen.getByRole('button', { name: /apply now/i }));

  expect(window.alert).toHaveBeenCalledWith('Only Job Seeker accounts can apply for jobs.');
  expect(applicationService.applyToJob).not.toHaveBeenCalled();
});
