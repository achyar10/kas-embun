import sequelizePaginate from 'sequelize-paginate'
export default (sequelize, DataTypes) => {
    const member = sequelize.define('member', {
        name: DataTypes.STRING,
        position: DataTypes.STRING,
    }, { paranoid: true })
    member.associate = function (models) {
        member.hasMany(models.income, {
            as: 'incomes',
            foreignKey: 'memberId',
            onDelete: 'CASCADE'
        })
        member.hasMany(models.present, {
            as: 'presents',
            foreignKey: 'memberId',
            onDelete: 'CASCADE'
        })
    }
    sequelizePaginate.paginate(member)
    return member;
}