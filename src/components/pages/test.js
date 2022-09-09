import  {ethers, BigNumber, utils, constants } from "ethers"
const { formatUnits } = utils

/*
 * Address for contract
 */
Address = {
	stable: "0x10362a71075ce4a925403D998b9f76Ec104eEFcf",
	splitter: "0x38ABc8b497501b8EF1ca6D9F7d439D081F817Ff4",
	lm: "0x241a4aF1b139090181b80Ca4Fe6829e1D75960C8",
	token: "0xeb96f5416d0ec1b1b0c00042a4a32738f1BbBe40",
	pair: "0x94cfa2662A665ADb089289270F70B29102cd1A93",
	dispatchManager: "0x743e81D98d57D1D2f5Cb70b3a536EbbF5891ceA7",
	badges: [
		"0xB4C9A6194fcf53BE1DD3970572358a6b23c9dc88",
		"0xFDdd456Be1f5B68Bd0D8380B5eE0d43A0bA0D966",
		"0x235FF1A520EC99b40c660445A21bAa4629920BD7",
	],
	badgeManager: "0x4DfDf57aA7B5cccE53E02E81E846De54dCD7ACAd"
]



/*
 * store structure for redux
 * all variables written are [store.variable] are from the store
 */
store = {
	decimals: 6, // hardcoded, will be used a lot
	pair: { // refer to 1
		reserveToken: "",
		reserveStable: "",
	},
	tokenGlobal: { // refer to 2
		totalSupply: "",
		totalBurn: ""
	},
	tokenUser: {
		balance: "",
		allowanceDispatchManager: false,
		allowanceLm: false,
	},
	stableUser: {
		balance: "",
		allowanceDispatchManager: false,
		allowanceLm: false,
	},
	badgesGlobal: [ // refer to 3, indexes are the same as in Address.badges
		{
			name: "",
			totalSupply: "",
			price: "",
			max: "0",
			rewardAmount: "0",
		},
		//... 
	],
	badgesUser: [ // indexes are the same as in Address.badges
		{
			balance: "",
			ids: [
				{
					creationTime: "",
					lastClaim: ""
				},
				//...
			]
		},
		//...
	],
	displayPayee: false,
	payees: [ // we ll talk about that later
		{
			address: "",
			shares: 0,
			pending: 0,
			released: 0
		},
		//...
	],
}

/*
 * 1 fill store.pair
 * To use for token price
 * priceDisplayed = parseFloat(formatUnits(store.reserveStable, store.decimals)) / parseFloat(formatUnits(store.reserveToken, store.decimals))
*/
async function getReserves() {
	const pair = new ethers.Contract(Address.pair, "./AbiUniswapV2Pair", provider)

	const datas = await pair.getReserves()

	let resToken, resStable
	if (BigNumber.from(Address.token).lt(Address.stable)) {
		resToken = datas[0]
		resStable = datas[1]
	} else {
		resToken = datas[1]
		resStable = datas[0]
	}
	return {
		reserveToken: resToken.toString(),
		reserveStable: resStable.toString(),
	}
}

/*
 * 2 fill store.totalSupplyToken
 * To use for token total supply
 * totalSupplyDisplayed = parseFloat(formatUnits(store.token.totalSupply, store.decimals))
 * totalBurnDisplayed = parseFloat(formatUnits(store.token.totalBurn, store.decimals))
*/

async function tokenGlobal() {
	const token = new ethers.Contract(Address.token, "./AbiToken", provider)

	return {
		totalSupply: (await token.totalSupply()).toString(),
		totalBurn: (await token.totalBurn()).toString()
	}
}

/*
 * market cap not to store in store but store to use
*/
function marketCap() {
	const price = parseFloat(formatUnits(store.reserveStable, store.decimals)) / parseFloat(formatUnits(store.reserveToken, store.decimals))
	const totalSupply = parseFloat(formatUnits(store.totalSupplyToken, store.decimals))

	return price * totalSupply
}

/*
 * 3 fill store.badgesGlobal
 * badgeIndexTotalSupply = store.badgesGlobal[index].totalSupply
 */
async function badgesGlobal() {
	const badgesGlobal = []

	for (let i = 0; i < Address.badges.length; i++) {
		const badge = new ethers.Contract(Address.badges[i], "./AbiBadge", provider)

		badgesGlobal.push(
			{
				name: await badge.name(),
				totalSupply: (await badge.totalSupply()).toString(),
				price: (await badge.price()).toString(),
				max: (await badge.max()).toString(),
				rewardAmount: (await badge.rewardAmount()).toString()
			}
		)
	}

	return badgesGlobal
}


import  {ethers, BigNumber, utils, constants } from "ethers"
const { formatUnits } = utils

/*
 * Address for contract
 */
Address = {
	stable: "0x10362a71075ce4a925403D998b9f76Ec104eEFcf",
	splitter: "0x38ABc8b497501b8EF1ca6D9F7d439D081F817Ff4",
	lm: "0x241a4aF1b139090181b80Ca4Fe6829e1D75960C8",
	token: "0xeb96f5416d0ec1b1b0c00042a4a32738f1BbBe40",
	pair: "0x94cfa2662A665ADb089289270F70B29102cd1A93",
	dispatchManager: "0x743e81D98d57D1D2f5Cb70b3a536EbbF5891ceA7",
	badges: [
		"0xB4C9A6194fcf53BE1DD3970572358a6b23c9dc88",
		"0xFDdd456Be1f5B68Bd0D8380B5eE0d43A0bA0D966",
		"0x235FF1A520EC99b40c660445A21bAa4629920BD7",
	]
	badgeManager: "0x4DfDf57aA7B5cccE53E02E81E846De54dCD7ACAd"
]

/*
 * store structure for redux
 * all variables written are [store.variable] are from the store
 */
store = {
	decimals: 6, // hardcoded, will be used a lot
	pair: { // refer to 1
		reserveToken: "",
		reserveStable: "",
	},
	tokenGlobal: { // refer to 2
		totalSupply: "",
		totalBurn: ""
	},
	tokenUser: {
		balance: "",
		allowanceDispatchManager: false,
		allowanceLm: false,
	},
	stableUser: {
		balance: "",
		allowanceDispatchManager: false,
		allowanceLm: false,
	},
	badgesGlobal: [ // refer to 3, indexes are the same as in Address.badges
		{
			name: "",
			totalSupply: "",
			price: "",
			max: "0",
			rewardAmount: "0",
		},
		//... 
	],
	badgesUser: [ // indexes are the same as in Address.badges
		{
			balance: "", 
			ids: [
				{
					creationTime: "",
					lastClaim: ""
				},
				//...
			]
		},
		//...
	],
	displayPayee: false,
	payees: [ // we ll talk about that later
		{
			address: "",
			shares: 0,
			pending: 0,
			released: 0
		},
		//...
	],
}

/*
 * 1 fill store.pair
 * To use for token price
 * priceDisplayed = parseFloat(formatUnits(store.reserveStable, store.decimals)) / parseFloat(formatUnits(store.reserveToken, store.decimals))
*/
async function getReserves() {
	const pair = new ethers.Contract(Address.pair, "./AbiUniswapV2Pair", provider)

	const datas = await pair.getReserves()

	let resToken, resStable
	if (BigNumber.from(Address.token).lt(Address.stable)) {
		resToken = datas[0]
		resStable = datas[1]
	} else {
		resToken = datas[1]
		resStable = datas[0]
	}
	return {
		reserveToken: resToken.toString(),
		reserveStable: resStable.toString(),
	}
}

/*
 * 2 fill store.totalSupplyToken
 * To use for token total supply
 * totalSupplyDisplayed = parseFloat(formatUnits(store.token.totalSupply, store.decimals))
 * totalBurnDisplayed = parseFloat(formatUnits(store.token.totalBurn, store.decimals))
*/
async function tokenGlobal() {
	const token = new ethers.Contract(Address.token, "./AbiToken", provider)

	return {
		totalSupply: (await token.totalSupply()).toString(),
		totalBurn: (await token.totalBurn()).toString()
	}
}

/*
 * market cap not to store in store but store to use
*/
function marketCap() {
	const price = parseFloat(formatUnits(store.reserveStable, store.decimals)) / parseFloat(formatUnits(store.reserveToken, store.decimals))
	const totalSupply = parseFloat(formatUnits(store.totalSupplyToken, store.decimals))

	return price * totalSupply
}

/*
 * 3 fill store.badgesGlobal
 * badgeIndexTotalSupply = store.badgesGlobal[index].totalSupply
 */
async function badgesGlobal() {
	const badgesGlobal = []

	for (let i = 0; i < Address.badges.length; i++) {
		const badge = new ethers.Contract(Address.badges[i], "./AbiBadge", provider)

		badgesGlobal.push(
			{
				name: await badge.name(),
				totalSupply: (await badge.totalSupply()).toString(),
				price: (await badge.price()).toString(),
				max: (await badge.max()).toString(),
				rewardAmount: (await badge.rewardAmount()).toString()
			}
		)
	}

	return badgesGlobal
}

/*
 * total nft
*/
function totalNft() {
	let total = 0
	for (let badge of store.badgesGlobal)
		total += parseInt(badge.totalSupply)
	return total
}

/*
 * to get total nft at a specific index
*/
function totalNftSingle(index) {
	return parseInt(store.badgesGlobal[i].totalSupply)
}
