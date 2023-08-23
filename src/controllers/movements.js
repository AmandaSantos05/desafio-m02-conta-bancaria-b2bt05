let { contas, saques, depositos, transferencias } = require('../bancodedados');
const { format } = require('date-fns');

const deposit = (req, res) => {
    const { numero_conta, valor } = req.body;


    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O número da conta é obrigatório!' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O valor é obrigatório!' });
    }

    const accounts = contas.find(conta => conta.numero === Number(numero_conta));

    if (!accounts) {
        return res.status(404).json({ mensagem: 'A conta não foi encontrada' });
    }


    if (valor <= 0) {
        return res.status(404).json({ mensagem: 'Não é permitido depósito com valores negativos ou zerados' });
    }

    const data = format(new Date(), "yyyy-MM-dd HH:mm:as")
    accounts.saldo += valor;

    depositos[depositos.length] = {
        data,
        numero_conta,
        valor
    }

    return res.send();


}

const toWithdraw = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O número da conta é obrigatório!' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O valor é obrigatório!' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória!' });
    }

    const accounts = contas.find(conta => conta.numero === Number(numero_conta));

    if (!accounts) {
        return res.status(404).json({ mensagem: 'A conta não foi encontrada' });
    }

    const senhaValida = contas.some(conta => conta.usuario.senha === senha);

    if (!senhaValida) {
        return res.status(400).json({ mensagem: 'Senha incorreta!' });
    }

    if (valor > accounts.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente para saque!' });
    }

    if (valor < 0) {
        return res.status(400).json({ mensagem: 'O valor não pode ser menor que zero!' });
    }

    const data = format(new Date(), "yyyy-MM-dd HH:mm:as")
    accounts.saldo -= valor;

    saques[saques.length] = {
        data,
        numero_conta,
        valor
    }

    res.send();

}


const transfer = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem) {
        return res.status(400).json({ mensagem: 'O número da conta é obrigatório!' });
    }

    if (!numero_conta_destino) {
        return res.status(400).json({ mensagem: 'O número da conta é obrigatório!' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O valor é obrigatório!' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória!' });
    }

    const conta_origem = contas.find(conta => conta.numero === Number(numero_conta_origem));

    if (!conta_origem) {
        return res.status(404).json({ mensagem: 'A conta de origem não foi encontrada' });
    }

    const conta_destino = contas.find(conta => conta.numero === Number(numero_conta_destino));



    if (!conta_destino) {
        return res.status(404).json({ mensagem: 'A conta destino não foi encontrada' });
    }

    if (conta_origem.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta!' });
    }

    if (valor > conta_origem.usuario.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
    }

    if (valor < 0) {
        return res.status(400).json({ mensagem: 'O valor não pode ser menor que zero!' });
    }

    conta_origem.saldo -= valor;
    conta_destino.saldo += valor;
    const data = format(new Date(), "yyyy-MM-dd HH:mm:as")

    transferencias[transferencias.length] = {
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    return res.send();

}

const balance = (req, res) => {
    const { numero_conta, senha } = req.query;

    const accounts = contas.find(conta => conta.numero === Number(numero_conta));

    if (!accounts) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontada!' });
    }

    if (accounts.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta!' });
    }

    const saldo = accounts.saldo;

    return res.status(200).json({ saldo });
}


const extract = (req, res) => {
    const { numero_conta, senha } = req.query;

    const accounts = contas.find(conta => conta.numero === Number(numero_conta));

    if (!accounts) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontada!' });
    }

    if (accounts.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta!' });
    }

    let extrato = {
        depositos: [],
        saques: [],
        transferenciasEnviadas: [],
        transferenciasRecebidas: []
    }

    for (let dep of depositos) {
        if (dep.numero_conta === numero_conta) {
            extrato.depositos.push(dep)
        }
    }


    for (let dep of saques) {
        if (dep.numero_conta === numero_conta) {
            extrato.saques.push(dep)
        }
    }

    for (let dep of transferencias) {
        if (dep.numero_conta_origem === numero_conta) {
            extrato.transferenciasEnviadas.push(dep)
        }
    }

    for (let dep of transferencias) {
        if (dep.numero_conta_destino === numero_conta) {
            extrato.transferenciasRecebidas.push(dep)
        }
    }


    return res.send(extrato)

}


module.exports = {
    deposit,
    toWithdraw,
    transfer,
    balance,
    extract
}