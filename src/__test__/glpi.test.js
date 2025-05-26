// __tests__/glpi.test.js
//--npm install --save-dev jest
const GLPI = require('../glpi');

const glpiBaseUrl = 'http://centralrmg.hmmg.local/';
const glpiAppToken = 'fakeAppToken'; // Use um token falso para os testes
const glpi = new GLPI(glpiBaseUrl, glpiAppToken);

describe.skip('GLPI API', () => {
  describe('initSession', () => {
    it('should return a session token', async () => {
      // Simulando uma chamada bem-sucedida
      const sessionToken = await glpi.initSession('user', 'pass');
      expect(sessionToken).toBeTruthy();
    });

    it('should throw an error for invalid credentials', async () => {
      // Simulando uma chamada com credenciais inválidas
      await expect(glpi.initSession('invalid_user', 'invalid_pass')).rejects.toThrow();
    });
  });

  describe('checkTicket', () => {
    const sessionToken = 'fakeSessionToken'; // Use um token falso para os testes

    it('should return ticket details', async () => {
      // Simulando uma chamada bem-sucedida
      const ticketDetails = await glpi.checkTicket(12345, sessionToken);
      expect(ticketDetails).toBeTruthy();
    });

    it('should throw an error for an invalid ticket ID', async () => {
      // Simulando uma chamada com um ID de ticket inválido
      await expect(glpi.checkTicket(99999, sessionToken)).rejects.toThrow();
    });
  });
});
