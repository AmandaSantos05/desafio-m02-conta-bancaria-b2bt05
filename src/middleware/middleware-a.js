const { contas } = require('../bancodedados')

const validarNumero_e_senha = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O número da conta é obrigatório!' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória!' });
    }

    next();
}


module.exports = {
    validarNumero_e_senha
}