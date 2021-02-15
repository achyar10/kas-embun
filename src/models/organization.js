import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const organization = sequelize.define('organization', {
        name: DataTypes.STRING,
        saldo: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, { paranoid: true })
    sequelizePaginate.paginate(organization)
    return organization;
}