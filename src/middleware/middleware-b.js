const { contas } = require('../bancodedados')

const validarDadosObrigatorios = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ ERRO: 'Obrigatório informar o nome' })
    }

    if (!cpf) {
        return res.status(400).json({ ERRO: 'Obrigatório informar o cpf' })
    }

    if (!data_nascimento) {
        return res.status(400).json({ ERRO: 'Obrigatório informar a data de nascimento' })
    }

    if (!telefone) {
        return res.status(400).json({ ERRO: 'Obrigatório informar o telefone' })
    }

    if (!email) {
        return res.status(400).json({ ERRO: 'Obrigatório informar o email' })
    }

    if (!senha) {
        return res.status(400).json({ ERRO: 'Obrigatório informar a senha' })
    }

    next()
}

const verificaEmail_e_cpfExistente = (req, res, next) => {
    const { cpf, email } = req.body;

    const verificaCpf = contas.some(conta => conta.usuario.cpf === cpf)

    if (verificaCpf) {
        return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf informado!' })
    }

    const verificaEmail = contas.some(conta => conta.usuario.email === email);

    if (verificaEmail) {
        return res.status(400).json({ mensagem: 'Já existe uma conta com o email informado!' })
    }
    next();
}

const verificaEmail_e_cpfRepetidos = (req, res, next) => {
    const numeroConta = Number(req.params.numeroConta);
    const { cpf, email } = req.body;

    const filtroContas = contas.filter(conta => conta.numero !== numeroConta);

    const verificaCpf = filtroContas.every(conta => conta.usuario.cpf === cpf);
    if (verificaCpf) {
        return res.json({ mensagem: 'O CPF informado já existe cadastrado!' });
    }

    const verificaEmail = filtroContas.every(conta => conta.usuario.email === email);
    if (verificaEmail) {
        return res.json({ mensagem: 'O email informado já existe cadastrado!' });
    }
    next()
}

const numeroContaInvalido = (req, res, next) => {
    const numeroConta = Number(req.params.numeroConta);

    if (isNaN(numeroConta)) {
        return res.status(400).json({ mensagem: 'O número da conta informado não é um número válido.' });
    }
    next()
}

module.exports = {
    validarDadosObrigatorios,
    verificaEmail_e_cpfExistente,
    verificaEmail_e_cpfRepetidos,
    numeroContaInvalido
}