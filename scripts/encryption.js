const bcrypt = require('bcrypt');

exports.encrypt = async function(password,salt){
    const hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
}

exports.decrypt = async function(typedPassword,hashedPassword){
    const chk = await bcrypt.compare(typedPassword,hashedPassword);
    return chk;
}