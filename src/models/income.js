import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const income = sequelize.define('income', {
        month: DataTypes.INTEGER,
        year: {
            type: 'YEAR'
        },
        type: {
            type: DataTypes.ENUM,
            values: ['kas', 'sparing', 'lainnya'],
            defaultValue: 'kas'
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, { paranoid: true })
    income.associate = function (models) {
        income.belongsTo(models.member)
    }
    sequelizePaginate.paginate(income)
    return income;
}