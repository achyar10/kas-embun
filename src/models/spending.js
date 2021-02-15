import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const spending = sequelize.define('spending', {
        date: {
            type: 'DATE'
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        desc: DataTypes.STRING,
    }, { paranoid: true })
    sequelizePaginate.paginate(spending)
    return spending;
}