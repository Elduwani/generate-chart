import transactions from "./data.js"
import { chartInit } from "./canvas.js"

const chartWrapper_node = document.querySelector(".chart-wrapper")

const filterOptions = [
    { value: 14, label: `Last 2 Weeks` },
    { value: 21, label: `Last 3 Weeks` },
    { value: 30, label: `Last 30 Days` },
    { value: 90, label: `Last 90 Days` },
    { value: 0, label: `Today` },
    { value: "this_week", label: `This Week` },
    { value: "this_month", label: `This Month` },
    { value: "this_year", label: `This Year` },
    { value: null, label: `All Time` },
]

const state = {
    count: 0,
    yLength: 10,
    maxAmount: 0,
    map: new Map(),
    mode: "daily",
}

displayChart(filterOptions[0].value)
generateSelect(filterOptions)


function displayChart(count) {
    let today = new Date()
    let numOfDays = count
    const isString = typeof count === "string"

    if (isString) {
        if (count === "this_week") {
            numOfDays = new Date().getDay() //<= day of the week for specified date. 0 is Sunday.
        } else if (count === "this_month") {
            numOfDays = (new Date().getDate()) - 1 // <= day of the month for specified date
        } else if (count === "this_year") {
            numOfDays = getElapsedDaysInYear(today.getFullYear())
        }
    }

    /**
     * Initial Map with default values
     */
    getPreviousCalendarDays(+numOfDays)
    state.count = +numOfDays

    /**
     * Aggregate transactions then --> generate days || weeks || months
    */
    aggregateTransactions()
    // This must be called last as it depends on {state.data} to be updated
    generateColumns()
    chartInit(state)

    const count_display_node = document.querySelector(".count-display")
    count_display_node.textContent = `Days: ${state.count} - Entries: ${state.map.size}`
}

function getPreviousCalendarDays(num = 60) {
    /**
     * This function returns all calendar days that have elapsed 
     * between today (now) and any number of days to the past
     * 
     * Initial state is  set here
    */

    let tempArr = [], dates = []
    let lastEntry, splitInto = "daily"
    state.map.clear() // Reset state before creating new entries

    if (num > 30 && num <= 90) splitInto = "weekly"
    else if (num > 90 && num < 200) splitInto = "monthly"
    else splitInto = "daily"
    state.mode = splitInto

    const setKeyOfArrays = (arr) => {
        const key = arr[0] + " - " + arr[arr.length - 1]
        state.map.set(key, { dates: arr, total: 0 })
    }

    for (let i = num; i >= 0; i--) {
        const a = new Date()
        const b = a.setDate(a.getDate() - i) //Get previous day: returns milliseconds
        const currentDate = new Date(b)
        const { shortDate } = formatDate(currentDate.toISOString())

        /**
         * The purpose of this section is to group months or weeks into separate arrays
         * 
         * 
        */
        if (splitInto === "weekly") {
            const newWeek = currentDate.getDay() // --> 0 Sun - 6 Sat
            if (newWeek > 0) {
                // We're still within a week, save & skip further evaluation
                tempArr.push(shortDate)
                continue
            }
            /**
             * It's the beginning of a new week, save this week's data and skip further evaluation
             * Also don't set undefined keys if there are no dates in this week
            */
            if (tempArr.length) {
                dates.push(tempArr)
                setKeyOfArrays(tempArr)
            }
            //Initialise new arr with current date otherise it's lost by next loop
            tempArr = [shortDate]
            continue

        } else if (splitInto === "monthly") {
            const monthIndex = currentDate.getMonth() // --> 0 Jan - 11 Dec
            if (lastEntry === undefined) lastEntry = monthIndex // <<lastEntry>> is undefined when the loop starts, and only when 
            if (lastEntry === monthIndex) tempArr.push(shortDate) // We're within same month
            if (lastEntry < monthIndex) { // We're in a new month
                /**
                    * Once we hit a new month push <<tempArr>> into <<dates>> then reset <<tempArr>>
                    * Also set <<lastEntry>> to new month
                */
                dates.push(tempArr)
                setKeyOfArrays(tempArr)
                tempArr = [shortDate] //Initialise new arr with current date otherise it's lost by next loop
                lastEntry = monthIndex // Reset last entry to new month
            }

        } else {
            // Default to daily
            state.map.set(shortDate, { total: 0 })
            dates.push(shortDate)
        }
    }

    /**
     * Important: <<tempArr>> still holds values for most recent month from the final loop
    */
    if (tempArr.length) {
        dates.push(tempArr)
        setKeyOfArrays(tempArr)
    }

    // console.log("getPreviousCalendarDays", state.map)

    return dates
}

function aggregateTransactions() {
    const x_axis = document.querySelector(".x-axis")
    x_axis.innerHTML = ""

    let maxAmount = 0
    //Populate x-axis
    state.map.forEach((value, key) => {
        const div = document.createElement("div")
        const div2 = document.createElement("div")
        div.classList.add("dates-wrapper")

        transactions.data.forEach(tr => {
            let { paid_at, amount, status } = tr
            let { shortDate: trxDate } = formatDate(paid_at)
            let { dates } = value

            if (status === "success") {
                /**
                 * <<dates>> is an array of all the dates between 
                 * and also the two dates that are the keys
                */
                if (dates && dates.includes(trxDate) || trxDate === key) {
                    // Must use map.get() bcos this inner loop references stale data
                    const { total } = state.map.get(key)
                    state.map.set(key, { ...value, total: total + (amount / 100) })
                }
            }
        })

        //update maximum amount
        const { total } = state.map.get(key)
        if (total > maxAmount) {
            maxAmount = total
        }

        div2.textContent = key
        div.appendChild(div2)
        x_axis.appendChild(div)
    })

    if (["weekly", "monthly"].includes(state.mode) && state.map.size > 10
        || state.mode === "daily" && state.map.size > 22) {
        chartWrapper_node.classList.add("rotateLabels")
    } else {
        chartWrapper_node.classList.remove("rotateLabels")
    }

    /**
     * Populate y-axis
    */
    const [yArray, limit] = getClosestNumArray(maxAmount, state.yLength)
    const y_axis = document.querySelector(".y-axis")
    y_axis.innerHTML = ""
    state.maxAmount = limit

    yArray.forEach(n => {
        const div = document.createElement("div")
        div.textContent = metricPrefix(n)
        y_axis.appendChild(div)
    })
}

function generateColumns() {
    const graph_wrapper_node = document.querySelector(".graph")
    graph_wrapper_node.innerHTML = ""

    const grid_node = document.createElement("div")
    grid_node.classList.add("grid-container")

    state.map.forEach((value) => {
        const wrapper = document.createElement("div")
        wrapper.classList.add("bar-container")
        const bar = document.createElement("div")
        const span = document.createElement("span")

        // const randNum = Math.floor(Math.random() * (max - min + 1)) + min
        const amnt = value.total

        if (amnt > 0) {
            const height = Math.trunc((amnt / state.maxAmount) * 100)
            span.textContent = amnt.toLocaleString("en-GB")
            bar.appendChild(span)
            bar.style.height = height + "%"
        }

        wrapper.appendChild(bar)
        graph_wrapper_node.appendChild(wrapper)
    })

    /**
     * Generate 10 grid lines
    */
    let count = 0
    while (count < state.yLength) {
        grid_node.appendChild(document.createElement("div"))
        count++
    }

    graph_wrapper_node.appendChild(grid_node)
}

function formatDate(date) {
    const d = new Date(date)
    const e = d.toUTCString()
    const [, day, month, year] = e.split(" ")
    const shortDate = `${month} ${day}`
    const longDate = `${month} ${day}, ${year}`
    const slashedDate = `${d.getMonth() + 1}/${day}/${year}`

    return { shortDate, longDate, slashedDate }
}

function getElapsedDaysInYear(year = 2020) {
    const now = Date.now() // returns milliseconds
    const then = new Date(year, 0).getTime() // returns milliseconds

    const oneDay = 1000 * 60 * 60 * 24
    const milliseconds = now - then
    return Math.round(milliseconds / oneDay) - 1
}

function generateSelect(options) {
    const select_node = document.querySelector(".select")
    let select = document.createElement("select")

    select.onchange = function () {
        displayChart(this.value)
    }

    options.forEach(s => {
        let el = document.createElement("option")
        el.setAttribute("value", s.value)
        el.textContent = s.label
        select.appendChild(el)
    })

    select_node.appendChild(select)
}

function getClosestNumArray(num, arrLength) {
    let len = String(num).length,
        n1 = String(num)[0],
        max = parseInt((+n1 + 1) + "0".repeat(len - 1))

    let array = [],
        unit = max / arrLength,
        count = 1;

    while (count <= arrLength) {
        array.push(count * unit)
        count++
    }

    return [array, max]
}

function metricPrefix(number) {
    const num = Math.abs(number)
    //Must start from largest number so it doesn't return lower true condition
    if (num > 999999999) return Math.sign(num) * ((num / 1000000000).toFixed(2)) + 'B'
    if (num > 999999) return Math.sign(num) * ((num / 1000000).toFixed(2)) + 'M'
    if (num > 999) return Math.sign(num) * ((num / 1000).toFixed(2)) + 'k'
    if (num < 999) return Math.sign(num) * num
}
