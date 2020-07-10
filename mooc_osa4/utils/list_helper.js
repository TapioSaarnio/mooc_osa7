const dummy = (blogs) => {

    return 1

}

const totalLikes = (blogs) => {

    const likes = blogs.map(arr => arr.likes)

    const sum = likes.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0)

    return sum
}

const favouriteBlog = (blogs) => {

    if(blogs.length === 0){
        return null
    }

    let winner = blogs[0]

    for (let i in blogs) {

        if(blogs[i].likes > winner.likes){     //if multiple candidates returns the first one in array
            winner = blogs[i]
        }
    }

    return winner
}

const returnTheFirstBlog = (blogs) => {

    return blogs[0]
}




module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    returnTheFirstBlog
}
