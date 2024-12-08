const {body} = require('express-validator')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const titleValidator = [
    body('title')
    .trim()
    .escape()
    .notEmpty().withMessage("title is required")
    .isLength({max: 50}).withMessage("title is too long")
]
const descriptionValidator = [
    body('description')
    .trim()
    .escape()
    .notEmpty().withMessage("description is required")
    .isLength({max: 250}).withMessage("description shoud be less than 250 cahracter")
]
const rolesValidator = [
    body('roles')
    .notEmpty().withMessage("at least on role is required")
    .custom((arr) => {
        if (!Array.isArray(arr))
            throw new Error("roles must be an array")
        if (arr.length === 0)
            throw new Error("at least on role is required")
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] !== 'object' || arr[i] === null) {
                throw new Error("roles must be objects")
            }
            if (!('role' in arr[i]) || !('no' in arr[i])) {
                throw new Error("Each role item must have 'role' and 'no' fields");
            }
            if (typeof arr[i].role !== 'string' || !Number.isInteger(arr[i].no) || arr[i].no < 0)
                throw new Error("Role must be a string, and 'no' must be a positive integer")
            if (Object.keys(arr[i]).length !== 2) {
                throw new Error("Each role item must have exactly 'role' and 'no' fields");
            }
        }
        return true
    })
]
const repoUrlValidator = [
    body('repo')
    .notEmpty().withMessage('Repository URL is required')
    .isURL().withMessage('Repository URL must be a valid URL')
    .custom(async (api) => {

        try {
            const post = await prisma.post.findFirst({
                where: {repo: api}
            })
            if (post)
                throw new Error("Repo URL Already Belong to Another Project")
        } catch(error) {
            throw new Error(error.message)
        }
        const apiParts = api.split('/')
        if (apiParts.length < 5 || (apiParts.length === 5 && apiParts[apiParts.length - 1] === ''))
            throw new Error("API URL is not complete");

        if (apiParts[0] !== 'https:' && apiParts[0] !== 'http:') 
            throw new Error('Please enter a valid "repo" URL');
        
        if (apiParts[2] !== "github.com")
            throw new Error('Invalid GitHub domain');

        const finalApi = `${apiParts[0]}//api.${apiParts[2]}/repos/${apiParts[3]}/${apiParts[4]}`
        
        try {
            const res = await fetch(finalApi)
            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error("repo not found");
                } else {
                    throw new Error("Failed to fetch the repo");
                }
            }
            await res.json(); // ignore the result, i'm just validate existence
            return true;
        } catch(error) {
            throw new Error(error.message)
        }
    })
]

module.exports = {
    titleValidator,
    descriptionValidator,
    rolesValidator,
    repoUrlValidator  
}