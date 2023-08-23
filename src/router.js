const express = require('express');
const accounts = require('./controllers/accounts');
const moviments = require('./controllers/movements');
const validatePassword = require('./middleware/validatePassword');
const { validarDadosObrigatorios, verificaEmail_e_cpfExistente, numeroContaInvalido, verificaEmail_e_cpfRepetidos } = require('./middleware/middleware-b');
const { validarNumero_e_senha } = require('./middleware/middleware-a')

const route = express();

route.get('/contas', validatePassword, accounts.listAccounts);
route.post('/contas', validarDadosObrigatorios, verificaEmail_e_cpfExistente, accounts.registerAccount);
route.put('/contas/:numeroConta/usuario', numeroContaInvalido, verificaEmail_e_cpfRepetidos, accounts.updateAccount);
route.delete('/contas/:numeroConta', numeroContaInvalido, accounts.deleteAccount);
route.post('/transacoes/depositar', moviments.deposit);
route.post('/transacoes/sacar', moviments.toWithdraw);
route.post('/transacoes/transferir', moviments.transfer);
route.get('/contas/saldo', validarNumero_e_senha, moviments.balance);
route.get('/contas/extrato', validarNumero_e_senha, moviments.extract);

module.exports = route;