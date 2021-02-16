import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const relation = sequelize.define('relation', {
    }, { paranoid: true })
    relation.associate = function (models) {
        relation.belongsTo(models.member, {
            as: 'member1'
        })
        relation.belongsTo(models.member, {
            as: 'member2'
        })
    }
    sequelizePaginate.paginate(relation)
    return relation;
}
