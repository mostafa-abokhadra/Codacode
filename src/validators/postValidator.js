const {body, param} = require('express-validator')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const {URL} = require('url')
const utils = require("../utils/utils")


const validateGitHubUsername = async (userId, repoOwner) => {
    const user = await prisma.user.findFirst({
        where: { id: userId },
        include: { GitHub: true },
    });

    if (!user) throw new Error("User not found to validate GitHub username");
    if (!user.GitHub) throw new Error("User is not github authentciate");

    const decryptedUsername = await utils.decryptToken(user.GitHub.githubUsername);

    if (decryptedUsername !== repoOwner) {
        throw new Error("Mismatch between GitHub repo owner and authenticated user");
    }
    return 1
};

const validateRepoUrl = async (url) => {
    const parsedUrl = new URL(url);

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol in repository URL');
    }

    if (parsedUrl.hostname !== 'github.com') {
        throw new Error('Invalid GitHub domain');
    }

    const [owner, repo] = parsedUrl.pathname.split('/').filter(Boolean);

    if (!owner || !repo) {
        throw new Error('Repository URL is incomplete');
    }

    const apiEndpoint = `${parsedUrl.protocol}//api.${parsedUrl.hostname}/repos/${owner}/${repo}`;

    const res = await fetch(apiEndpoint);

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error('Repository not found');
        } else {
            throw new Error('Failed to fetch the repository');
        }
    }
    return { owner, repo };
};

const titleValidator = [
    body('title')
    .trim()
    .escape()
    .notEmpty().withMessage("title is required")
    .isLength({min: 10}).withMessage('title must be 10 - 50 letters')
    .isLength({max: 50}).withMessage("title must be 10 - 50 letters")
    .custom((value) => {
        if (Number(value))
            throw new Error('title must be a string')
        return 1
    })
]
const descriptionValidator = [
    body('description')
    .trim()
    .escape()
    .notEmpty().withMessage("description is required")
    .isLength({min: 30}).withMessage('description length should be 30 - 250 letters')
    .isLength({max: 250}).withMessage("description length should be 30 - 250 letters")
    .custom((value) => {
        if (Number(value))
            throw new Error('description must be a string')
        return 1
    })
]
const rolesValidator = [
    body('roles')
    .notEmpty().withMessage("at least one role is required")
    .custom((arr) => {
        try {
            if (typeof arr !== 'object') {
                arr = JSON.parse(arr)
            }
        } catch(error) {
            throw new Error("can't parse roles to json object")
        }
        if (!Array.isArray(arr)) {
            throw new Error("roles must be an array")
        }
        if (arr.length === 0)
            throw new Error("at least one role is required")
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== null &&
                typeof arr[i] !== 'object' && 
                !Array.isArray(arr[i]) ) {
                throw new Error("roles must be objects")
            }
            if (!('role' in arr[i]) || !('numberNeeded' in arr[i])) {
                throw new Error("Each role item must have 'role' and 'numberNeeded' fields");
            }
            if (typeof arr[i].role !== 'string' ||
                !Number.isInteger(Number(arr[i].numberNeeded)) || Number(arr[i].numberNeeded) < 1) {
                throw new Error("Role must be a string, and 'numberNeeded' must be a positive integer")
            }
            if (Object.keys(arr[i]).length !== 2) {
                throw new Error("Each role item must have exactly 'role' and 'numberNeeded' fields");
            }
        }
        return true
    })
]
const repoUrlValidator = [
    body('repo')
    .trim()
    .notEmpty().withMessage('Repository URL is required')
    .isURL().withMessage('Repository URL must be a valid URL')
    .custom(async (repoUrl, {req}) => {
        try {
            const existingPost = await prisma.post.findFirst({
                where: {repo: repoUrl}
            })
            if (existingPost)
                throw new Error("Repo URL Already Belong to Another Project")
            const { owner } = await validateRepoUrl(repoUrl);
            await validateGitHubUsername(req.user.id, owner);
            return true

        } catch(error) {
            throw new Error(error.message)
        }
    })
]
const yourRoleValidator = [
    body('yourRole')
    .trim()
    .escape()
    .notEmpty().withMessage("your role is required")
    .isString().withMessage("your role must be descriptive")
    .isLength({max: 30}).withMessage("your role must be less than 30 characters long")
    .custom((value) => {
        if (Number(value))
            throw new Error('your role must be a string')
        return 1
    })
]
const langPrefValidator = [
    body('langPref')
    .trim()
    .escape()
    .notEmpty().withMessage("language is required")
    .isLength({max: 20}).withMessage("language should be less than 20 character")
    .custom((value) => {
        if (Number(value))
            throw new Error('lang pref must be a string')
        return 1
    })
]
module.exports = {
    titleValidator,
    descriptionValidator,
    rolesValidator,
    repoUrlValidator,
    yourRoleValidator,
    langPrefValidator,
    validateGitHubUsername,
    validateRepoUrl
}