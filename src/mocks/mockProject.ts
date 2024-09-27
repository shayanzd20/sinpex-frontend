import { Project } from '../interfaces';

export const generateRandomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';
  for (let i = 0; i < 8; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomId;
};

export const mockProject: Project = {
  projectId: generateRandomId(),
  name: 'Sample Project',
  columns: [
    {
      columnId: generateRandomId(),
      name: 'TODO',
      cases: [
        {
          caseId: generateRandomId(),
          title: 'Case 1',
          progress: 10,
          updatedAt: '2023-09-20',
        },
        {
          caseId: generateRandomId(),
          title: 'Case 2',
          progress: 20,
          updatedAt: '2023-09-21',
        },
      ],
    },
    {
      columnId: generateRandomId(),
      name: 'IN PROGRESS',
      cases: [
        {
          caseId: generateRandomId(),
          title: 'Case 3',
          progress: 50,
          updatedAt: '2023-09-22',
        },
      ],
    },
    {
      columnId: generateRandomId(),
      name: 'Quality Control',
      cases: [
        {
          caseId: generateRandomId(),
          title: 'Case 4',
          progress: 100,
          updatedAt: '2023-09-23',
        },
      ],
    },
    {
      columnId: generateRandomId(),
      name: 'Done',
      cases: [
        {
          caseId: generateRandomId(),
          title: 'Case 5',
          progress: 80,
          updatedAt: '2023-09-24',
        },
        {
          caseId: generateRandomId(),
          title: 'Case 6',
          progress: 60,
          updatedAt: '2023-09-25',
        },
        {
          caseId: generateRandomId(),
          title: 'Case 7',
          progress: 90,
          updatedAt: '2023-09-26',
        },
      ],
    },
  ],
};
