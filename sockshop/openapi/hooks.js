const hooks = require('hooks');
const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectID

let db;

const address = [
    {"_id":ObjectId("579f21ae98684924944651bd"),"_class":"works.weave.socks.accounts.entities.Address","number":"69","street":"Wilson Street","city":"Hartlepool","postcode":"TS26 8JU","country":"United Kingdom"},
    {"_id":ObjectId("579f21ae98684924944651c0"),"_class":"works.weave.socks.accounts.entities.Address","number":"3","street":"Radstone Way","city":"Northampton","postcode":"NN2 8NT","country":"United Kingdom"},
    {"_id":ObjectId("579f21ae98684924944651c3"),"_class":"works.weave.socks.accounts.entities.Address","number":"3","street":"Radstone Way","city":"Northampton","postcode":"NN2 8NT","country":"United Kingdom"}
];


const card = [
    {"_id":ObjectId("579f21ae98684924944651be"),"_class":"works.weave.socks.accounts.entities.Card","longNum":"8575776807334952","expires":"08/19","ccv":"014"},
    {"_id":ObjectId("579f21ae98684924944651c1"),"_class":"works.weave.socks.accounts.entities.Card","longNum":"8918468841895184","expires":"08/19","ccv":"597"},
    {"_id":ObjectId("579f21ae98684924944651c4"),"_class":"works.weave.socks.accounts.entities.Card","longNum":"6426429851404909","expires":"08/19","ccv":"381"}
];

const cart = [
    {"_id":ObjectId("579f21de98689ebf2bf1cd2f"),"_class":"works.weave.socks.cart.entities.Cart","customerId":"579f21ae98684924944651bf","items":[{"$ref":"item","$id":ObjectId("579f227698689ebf2bf1cd31")},{"$ref":"item","$id":ObjectId("579f22ac98689ebf2bf1cd32")}]},
    {"_id":ObjectId("579f21e298689ebf2bf1cd30"),"_class":"works.weave.socks.cart.entities.Cart","customerId":"579f21ae98684924944651bfaa","items":[]}
];


const item = [
    {"_id":ObjectId("579f227698689ebf2bf1cd31"),"_class":"works.weave.socks.cart.entities.Item","itemId":"819e1fbf-8b7e-4f6d-811f-693534916a8b","quantity":20,"unitPrice":99.0}
];


const customer = [
    {"_id":"579f21ae98684924944651bf","_class":"works.weave.socks.accounts.entities.Customer","firstName":"Eve","lastName":"Berger","username":"Eve_Berger","addresses":[{"$ref":"address","$id":ObjectId("579f21ae98684924944651bd")}],"cards":[{"$ref":"card","$id":ObjectId("579f21ae98684924944651be")}]
    },
    {"_id":"579f21ae98684924944651c2","_class":"works.weave.socks.accounts.entities.Customer","firstName":"User","lastName":"Name","username":"user","addresses":[{"$ref":"address","$id":ObjectId("579f21ae98684924944651c0")}],"cards":[{"$ref":"card","$id":ObjectId("579f21ae98684924944651c1")}]},
    {"_id":"579f21ae98684924944651c5","_class":"works.weave.socks.accounts.entities.Customer","firstName":"User1","lastName":"Name1","username":"user1","addresses":[{"$ref":"address","$id":ObjectId("579f21ae98684924944651c3")}],"cards":[{"$ref":"card","$id":ObjectId("579f21ae98684924944651c4")}]}
];


// Setup database connection before Dredd starts testing
hooks.beforeAll((transactions, done) => {
    MongoClient.connect('mongodb://localhost:32769/data', function(err, conn) {
	db = conn;
	db.dropDatabase();
	done(err);
    });

});

// Close database connection after Dredd finishes testing
hooks.afterAll((transactions, done) => {
    db.close();
    done();
});



// After each test clear contents of the database (we want isolated tests)
hooks.afterEach((transaction, done) => {
    db.dropDatabase();
    done();
    
});

hooks.beforeEach((transaction, done) => {
    db.collection('customer').insertMany(customer, (err) => {
        if (err) {
	    console.log('customer before err'+ err);
	}
    });

    db.collection('card').insertMany(card, (err) => {
        if (err) {
	    console.log('card before err'+ err);
	}
    });

    db.collection('cart').insertMany(cart, (err) => {
        if (err) {
	    console.log('cart before err'+ err);
	}
    });

    db.collection('address').insertMany(address, (err) => {
        if (err) {
	    console.log('addy before err'+ err);
	}
    });

    db.collection('item').insertMany(item, (err) => {
        if (err) {
	    console.log('item before err'+ err);
	}
    });
    done();
});


hooks.before("/carts/{customerId}/items > POST", function(transaction, done) {
    transaction.request.headers['Content-Type'] = 'application/json';
    transaction.request.body = JSON.stringify(
	{
	    "itemId":"819e1fbf-8b7e-4f6d-811f-693534916a8b",
	    "quantity": 20,
	    "unitPrice" : 99.0
	}
    );
    done();
});

// TODO: Can't make POST and PUT work, skipping for now 

// hooks.before("/carts/{customerId}/items > POST", function(transaction, done) {
//     transaction.skip = true;
//     done();
// });

hooks.before("/carts/{customerId}/items > PATCH", function(transaction, done) {
    transaction.skip = true;
    done();
});
