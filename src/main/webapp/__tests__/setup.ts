import 'jest-canvas-mock';
jest.mock('../app/scanexam/services/workerimport', () => ({ worker: Promise.resolve(), worker1: Promise.resolve() }));
