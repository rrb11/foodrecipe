
export default class CustomManager 
{
    constructor()
    {

    }
    createOrGetUser(data)
    {
        if(window.localStorage.getItem(data.id))
        {
            return JSON.parse(window.localStorage.getItem(data.id));
        } else {
            let information = {
                'name': data.displayName,
            };
            window.localStorage.setItem(data.id,JSON.stringify(information));
            return information;
        }
    }
}