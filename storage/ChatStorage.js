const fs = require('fs');

module.exports = class ChatStorage {
  constructor(ruta) {
    this.ruta = ruta;
  }

  async save(messages) {
    try {
      await fs.promises.writeFile(
        this.ruta,
        JSON.stringify(messages, null, '\t')
      );
    } catch (error) {
      throw new Error('Error al guardar.');
    }
  }

  async read() {
    try {
      const content = await fs.promises.readFile(this.ruta);
      const messages = JSON.parse(content);
      return messages;
    } catch (error) {
      return [];
    }
  }

  async delete() {
    try {
      await fs.promises.rm(this.ruta);
    } catch (error) {
      throw new Error('Error al borrar el archivo');
    }
  }
};
