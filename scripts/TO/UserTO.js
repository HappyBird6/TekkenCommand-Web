class UserTO {
    #seq;
    #id;
    #nickname;
    #password;
    constructor(id='', nickname='', password='',seq='') {
        this.#id = id;
        this.#nickname = nickname;
        this.#password = password;
        this.#seq = seq;
    }
    toJSON() {
        return {
            id: this.#id,
            nickname: this.#nickname,
            password: this.#password,
            seq: this.#seq,
        };
    }
    static fromJSON(json) {
        const {id, nickname, password,seq } = json;
        return new UserTO(id, nickname, password,seq);
    }
    get seq() {
        return this.#seq;
    }
    set seq(seq){
        this.#seq = seq;
    }
    get id() {
        return this.#id;
    }
    set id(id){
        this.#id = id;
    }

    get nickname() {
        return this.#nickname;
    }
    set nickname(nickname) {
        this.#nickname = nickname;
    }

    get password(){
        return this.#password;
    }
    set password(password){
        this.#password = password;
    }
}

module.exports = UserTO;