// glpi.test.js
const axios = require('axios');
const GLPI = require('../glpi');

const glpiBaseUrl = 'http://centralrmg.hmmg.local/';
const glpiAppToken = 'fakeAppToken';
const glpi = new GLPI(glpiBaseUrl, glpiAppToken);

describe.skip('GLPI API', () => {
    beforeEach(() => {
        // Setup: código executado antes de cada teste na suite de testes
        console.log('------ Each')

      });
      
  describe('initSession', () => {
    beforeAll(() => {
        // Setup: código executado uma vez antes de todos os testes na suite de testes
        console.log('------ Antes')
      });
    it('should return a session token Mock', async () => {
      const sessionToken = await glpi.initSession('user', 'pass');

      expect(sessionToken).toEqual('fakeSessionToken');
      expect(axios.post).toHaveBeenCalledWith(
        'http://centralrmg.hmmg.local/initSession/',
        expect.objectContaining({
          headers: expect.objectContaining({
            'App-Token': 'fakeAppToken',
            'Content-Type': 'application/json',
          }),
          data: JSON.stringify({
            input: {
              user: 'user',
              pass: 'pass',
            },
          }),
        })
      );
    });
    afterAll(() => {
        console.log('------ Depois')

        // Teardown: código executado uma vez depois de todos os testes na suite de testes
      });
      
  });

  describe('checkTicket', () => {
    it('should return ticket details ', async () => {
      const ticketDetails = await glpi.checkTicket(12345, 'fakeSessionToken');

      expect(ticketDetails).toEqual({
        id: 123,
        name: 'Ticket Name',
        content: 'Ticket Content',
        status: 1,
        date_creation: '2024-05-08',
      });
      expect(axios.get).toHaveBeenCalledWith(
        'http://centralrmg.hmmg.local/Ticket/12345',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Session-Token': 'fakeSessionToken',
            'App-Token': 'fakeAppToken',
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });

  afterEach(() => {
    // Teardown: código executado após cada teste na suite de testes
    console.log('------ Down')

  });
})