import { Canister, Err, Ok, Principal, Record, Result, StableBTreeMap, Variant, Vec, bool, ic, query, text, update, } from 'azle';

const Contact = Record({
    username: text,
});
type Contact = typeof Contact.tsType;

const User = Record({
    id: Principal,
    username: text,
    contacts: Vec(Contact),
});
type User = typeof User.tsType;

const users = StableBTreeMap<Principal, User>(0);

const CreateUserErrors = Variant({
    UsernameAlreadyExists: text,
    UserAlreadyExists: Principal,
});

const AddContactErrors = Variant({
    UserNotFound: Principal,
    ContactAlreadyExists: text,
});

const RemoveContactErrors = Variant({
    UserNotFound: Principal,
    ContactNotFound: text,
});

export default Canister({
    create: update([text], Result(bool, CreateUserErrors), async (username) => {
        if (users.get(ic.caller()).Some) {
            return Err({ UserAlreadyExists: ic.caller() });
        }

        const existingUsername = users.values().find((user) => user.username === username);

        if (existingUsername) {
            return Err({ UsernameAlreadyExists: username });
        }

        const user: User = {
            id: ic.caller(),
            username,
            contacts: []
        }

        users.insert(ic.caller(), user);

        return Ok(true);
    }),
    getAll: query([], Vec(User), async () => users.values(), { guard: authGuard }),
    addContact: update([text], Result(bool, AddContactErrors), (username) => {
        const user = users.get(ic.caller()).Some;

        if (!user) {
            return Err({ UserNotFound: ic.caller() });
        }

        const existingContact = user.contacts.find((contact) => contact.username === username);

        if (existingContact) {
            return Err({ ContactAlreadyExists: username });
        }

        const contact: Contact = {
            username
        }

        user.contacts.push(contact);

        users.insert(ic.caller(), user);

        return Ok(true);
    }, { guard: authGuard }),
    removeContact: update([text], Result(bool, RemoveContactErrors), (username) => {
        const user = users.get(ic.caller()).Some;

        if (!user) {
            return Err({ UserNotFound: ic.caller() });
        }

        const existingContact = user.contacts.find((contact) => contact.username === username);

        if (!existingContact) {
            return Err({ ContactNotFound: username });
        }

        user.contacts = user.contacts.filter((contact) => contact.username !== username);

        users.insert(ic.caller(), user);

        return Ok(true);
    }, { guard: authGuard }),
});

function authGuard() {
    const isAuthenticated = !ic.caller().isAnonymous();

    if (!isAuthenticated) {
        throw new Error('Unauthorized');
    }
}
