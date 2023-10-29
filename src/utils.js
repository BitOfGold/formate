export function throttle(func, delay) {
    let prev = 0
    return (...args) => {
        let now = new Date().getTime()
        if (now - prev > delay) {
            prev = now
            return func(...args)
        }
    }
}

export function tailwindSanitize(...args) {
    let classes = " "
    args.forEach((arg) => {
        if (arg) {
            classes += arg + " "
        }
    })
    classes = classes.replace(/\n/g, " ").replace(/\s+/g, " ").trim()
    return " " + classes + " "
}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

export function sanitizeOptions(opts) {
    let res = []
    
    if (Array.isArray(opts)) {
        res = opts
    } else if (typeof opts == 'object') {
        res = Object.keys(opts).map((key) => {
            let title = opts[key]
            if (typeof title == 'object') {
                title.value = key
                return title
            } else {
                return {
                    value: key,
                    title: title,
                }
            }
        })
    } else {
        res = []
    }

    res.forEach((o) => {
        if (!o.title) {
            o.title = o.code
        }
        if (o.code === undefined) {
            o.code = o.title
        }
        if (isNumeric(o.code)) {
            o.code = o.code - 0
        }
    })

    return res
}
