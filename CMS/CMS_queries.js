class queries {
    constructor(connection) {
        this.connection = connection;
    }

    wait() {
        setTimeout(() => {
            console.log('this one');
        }, 2000);
    }
}

module.exports = queries;