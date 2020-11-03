module.exports = {
    
    // Verifica se a requisição contém todos os parametros solicitados 

    verifica(body, lista_parametros) {
        let parametro_atual;
        lista_parametros.forEach(parametro => {
            switch (typeof(body[parametro])) {
                case "string":
                    parametro_atual = body[parametro].trim();
                    if (!parametro_atual) throw {status: 400, message: "missing information"};
                    switch (parametro) {
                        case "email":
                            if (!/^\S+@\S+$/.test(parametro_atual)) throw {status: 400, message: "invalid email"};    
                        break;
                        case "name":
                            parametro_atual = parametro_atual.toLowerCase().split(' ').filter((val) => val).map((val) => val[0].toUpperCase() + val.slice(1)).join(' ');
                        break;
                        case "phone_number":
                            parametro_atual = parametro_atual.split(' ').join('');
                        break;
                    }
                    body[parametro] = parametro_atual;
                break;
                case "undefined":
                    throw {status: 400, message: "missing information"};     
            }
        });
        return body;
    },

    validatedPassword(password) {
        if (typeof(password) != "string") throw {message: "password must be a string"};

        if (password.length < 8) return false;

        
        return true;
    }


}
