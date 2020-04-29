import axios from '../axios'

/* 
 * 文章分类管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/webCore/ArticleClassify/save',
        method: 'post',
        data
    })
}
export const findByName = (params) => {
    return axios({
        url: '/webCore/ArticleClassify/findByName',
        method: 'get',
        params
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/webCore/ArticleClassify/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/webCore/ArticleClassify/findPage',
        method: 'post',
        data
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/webManage/ArticleClassify/findPermissions',
        method: 'get',
        params
    })
}