class SocialNetworkQueries {

    constructor({ fetchCurrentUser }) {
        this.fetchCurrentUser = fetchCurrentUser;
    }

    findPotentialLikes({ minimalScore } = {}) {
        const currentuserPromise = this.fetchCurrentUser();
        const potentialBook = { books:[] };
        currentuserPromise.then(user => {
            const friendsCnt = user.friends.length;

            const book = user.friends.reduce((acc , curFriend) => {
                if(curFriend.likes === undefined) return acc;
                curFriend.likes.books.forEach(element => {
                    if(element in acc) acc[element] ++;
                    else acc[element] = 1;
                });
                return acc;
            },{})

            const sortable = Object.entries(book)
                        .sort(([ka,va],[kb,vb]) => vb === va ? ka.localeCompare(kb, "en", { sensitivity: "base" }) : vb - va)
                        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
            
            for (const [key , value] of Object.entries(sortable)){
                if(value >= friendsCnt * minimalScore){
                    const filtered = user.likes.books.filter(item => item === key);
                    if(filtered.length === 0)
                        potentialBook.books.push(key);
                }
            }

        }).catch(error => console.log(error));

        return Promise.resolve(potentialBook);
    }

}

export { SocialNetworkQueries };
