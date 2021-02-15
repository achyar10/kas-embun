export default (sequelize, DataTypes) => {
    const session = sequelize.define('session', {
        data: DataTypes.TEXT
    }, { timestamps: false })
    return session;
}