let { contas } = require('../bancodedados');

let numeroProximaConta = 3;
let saldoInicial = 0;

const listAccounts = (req, res) => {
    return res.status(200).json(contas);
}

const registerAccount = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const newAccount = {
        numero: numeroProximaConta,
        saldo: saldoInicial,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(newAccount);

    numeroProximaConta++

    return res.send()
}


const updateAccount = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const numeroConta = Number(req.params.numeroConta);

    const contaExistente = contas.find(conta => conta.numero === numeroConta);

    if (!contaExistente) {
        return res.status(404).json({ mensagem: 'Não existe conta com o número informado' });
    }

    if (nome) {
        contaExistente.usuario.nome = nome;
    }

    if (cpf) {
        contaExistente.usuario.cpf = cpf;
    }

    if (data_nascimento) {
        contaExistente.usuario.data_nascimento = data_nascimento;
    }

    if (telefone) {
        contaExistente.usuario.telefone = telefone;
    }

    if (email) {
        contaExistente.usuario.email = email;
    }

    if (senha) {
        contaExistente.usuario.senha = senha;
    }

    return res.send();
}


const deleteAccount = (req, res) => {
    const numeroConta = Number(req.params.numeroConta);

    numeroContaInvalido;

    const accounts = contas.find(conta => conta.numero === numeroConta);

    if (!accounts) {
        return res.status(404).json({ mensagem: 'A conta não foi encontrada' });
    }

    if (accounts.saldo > 0) {
        return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
    }

    contas = contas.filter(conta => conta.numero !== numeroConta);

    return res.send();
}



module.exports = {
    listAccounts,
    registerAccount,
    updateAccount,
    deleteAccount
}