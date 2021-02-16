import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const present = sequelize.define('present', {
        date: {
            type: 'DATE'
        }
    }, { paranoid: true })
    present.associate = function (models) {
        present.belongsTo(models.member)
    }
    sequelizePaginate.paginate(present)
    return present;
}
