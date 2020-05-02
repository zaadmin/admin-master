import axios from '../axios'
/* 
 * 文章内容管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/webCore/Article/save',
        method: 'post',
        data
    })
}
export const findByName = (params) => {
    return axios({
        url: '/webCore/Article/findByName',
        method: 'get',
        params
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/webCore/Article/delete',
        method: 'post',
        data
    })
}
// 查询某一条
export const findOneByID = (data) => {
    return axios({
        url: '/webCore/Article/findOneById',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/webCore/Article/findPage',
        method: 'post',
        data
    })
}

//文章类型和标签
export const getValidData = () => {
    return axios({
        url: '/webCore/Article/getValidData',
        method: 'get'
    })
}