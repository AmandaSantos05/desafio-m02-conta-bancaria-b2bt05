const validatePassword = (req, res, next) => {
    const senha = req.query.senha_banco;

    if (!senha) {
        return res.json({ mensagem: 'Obrigatório informar a senha' });
    }

    if (senha != 'Cubos123Bank') {
        return res.json({ mensagem: 'Senha incorreta!' })
    }

    next();
}


module.exports = validatePassword;