const mysql = require('mysql')
const config = require('./db')
const express = require('express')
const fs = require('fs')
const dotenv = require('dotenv')
const path = require('path')
const { error } = require('console')

dotenv.config()

const app = express()

app.get('/', function (req, res) {

    let filePath = path.join(__dirname, 'readme.txt')
    let readStream = fs.createReadStream(filePath)
    readStream.on('open', function () {
        readStream.pipe(res.status(200))
    })
})

app.get('/order', function (req, res) {
    const connection = mysql.createConnection(config)

    connection.connect()

    connection.query(`SELECT nama_penyedia, nama_sumber_dana, kode_order, nama_pelanggan, tgl_order, total_order, status_order, id_order FROM tb_order WHERE (nama_penyedia LIKE "TD%" OR nama_penyedia = "Tisera Distribusindo") AND tgl_order >= CURDATE() - INTERVAL 7 DAY ORDER BY tgl_order`, (err, rows, fields) => {
        if (err) {
            res.status(400).send('Error: terdapat kesalahan pada route.')
        }

        // Data presentation 
        // const csvString = [
        //     [
        //         "ID Order",
        //         "Nama Penyedia",
        //         "Nama Sumber Dana",
        //         "Kode Order",
        //         "Nama Pelanggan",
        //         "Tanggal Order",
        //         "Total Order",
        //         "Status Order"
        //     ],
        //     ...rows.map(row => [
        //         row.id_order, row.nama_penyedia, row.nama_sumber_dana, row.kode_order, row.nama_pelanggan, row.tgl_order.toISOString().replace(/T.+/, ''), row.total_order, row.status_order
        //     ])
        // ].map(e => e.join(" | ")).join("\<br>")
        // res.send(csvString)

        res.status(200).send(rows)
    })

    connection.end()
})

app.get('/order/csv', function (req, res) {
    const connection = mysql.createConnection(config)

    connection.connect()

    connection.query(`SELECT nama_penyedia, nama_sumber_dana, kode_order, nama_pelanggan, tgl_order, total_order, status_order, id_order FROM tb_order WHERE (nama_penyedia LIKE "TD%" OR nama_penyedia = "Tisera Distribusindo") AND tgl_order >= CURDATE() - INTERVAL 7 DAY ORDER BY tgl_order`, (err, rows, fields) => {
        if (err) {
            res.status(400).send('Error: terdapat kesalahan pada route.')
        }

        const csvString = [
            [
                "ID Order",
                "Nama Penyedia",
                "Nama Sumber Dana",
                "Kode Order",
                "Nama Pelanggan",
                "Tanggal Order",
                "Total Order",
                "Status Order"
            ],
            ...rows.map(row => [
                row.id_order, row.nama_penyedia, row.nama_sumber_dana, row.kode_order, row.nama_pelanggan, row.tgl_order.toISOString().replace(/T.+/, ''), row.total_order, row.status_order
            ])
        ].map(e => e.join(";")).join("\n")

        res.setHeader('Content-disposition', 'attachment; filename=report_weekly.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvString);
    })

    connection.end()
})

app.get('/orderDetail', function (req, res) {
    const connection = mysql.createConnection(config)

    connection.connect()

    connection.query(`SELECT id_order, nama_produk, harga, qty, subtotal, id FROM tb_order_detail WHERE id_order IN ( SELECT id_order FROM tb_order WHERE (nama_penyedia LIKE "TD%" OR nama_penyedia = "Tisera Distribusindo") AND tgl_order >= CURDATE() - INTERVAL 7 DAY)`, (err, rows, fields) => {
        if (err) {
            res.status(400).send('Error: terdapat kesalahan pada route.')
        }

        // const csvString = [
        //     [
        //         "ID Order",
        //         "Nama Produk",
        //         "Harga",
        //         "Qty",
        //         "Subtotal"
        //     ],
        //     ...rows.map(row => [
        //         row.id_order, row.nama_produk, row.harga, row.qty, row.subtotal
        //     ])
        // ].map(e => e.join(" | ")).join("\<br>")
        // res.send(csvString)
        res.status(200).send(rows)
    })

    connection.end()
})

app.get('/orderDetail/csv', function (req, res) {
    const connection = mysql.createConnection(config)

    connection.connect()

    connection.query(`SELECT id_order, nama_produk, harga, qty, subtotal, id FROM tb_order_detail WHERE id_order IN ( SELECT id_order FROM tb_order WHERE (nama_penyedia LIKE "TD%" OR nama_penyedia = "Tisera Distribusindo") AND tgl_order >= CURDATE() - INTERVAL 7 DAY)`, (err, rows, fields) => {
        if (err) {
            res.status(400).send('Error: terdapat kesalahan pada route.')
        }

        const csvString = [
            [
                "ID Order",
                "Nama Produk",
                "Harga",
                "Qty",
                "Subtotal"
            ],
            ...rows.map(row => [
                row.id_order, row.nama_produk, row.harga, row.qty, row.subtotal
            ])
        ].map(e => e.join(";")).join("\n")

        res.setHeader('Content-disposition', 'attachment; filename=report_detail_weekly.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvString);
    })

    connection.end()
})

app.get('/orderDetail/:id', function (req, res) {
    const connection = mysql.createConnection(config)

    connection.connect()

    connection.query(`SELECT id_order, nama_produk, harga, qty, subtotal FROM tb_order_detail WHERE id_order = ${req.params.id}`, (err, rows, fields) => {
        if (err) {
            res.status(400).send('Error: terdapat kesalahan pada route.')
        }
        // const csvString = [
        //     [
        //         "ID Order",
        //         "Nama Produk",
        //         "Harga",
        //         "Qty",
        //         "Subtotal"
        //     ],
        //     ...rows.map(row => [
        //         row.id_order, row.nama_produk, row.harga, row.qty, row.subtotal
        //     ])
        // ].map(e => e.join(" | ")).join("\<br>")
        // res.send(csvString)
        res.status(200).send(rows)
    })

    connection.end()
})

app.get('/orderDetail/:id/csv', function (req, res) {
    const connection = mysql.createConnection(config)

    connection.connect()

    connection.query(`SELECT id_order, nama_produk, harga, qty, subtotal FROM tb_order_detail WHERE id_order = ${req.params.id}`, (err, rows, fields) => {
        if (err) {
            res.status(400).send('Error: terdapat kesalahan pada route.')
        }

        const csvString = [
            [
                "ID Order",
                "Nama Produk",
                "Harga",
                "Qty",
                "Subtotal"
            ],
            ...rows.map(row => [
                row.id_order, row.nama_produk, row.harga, row.qty, row.subtotal
            ])
        ].map(e => e.join(";")).join("\n")

        res.setHeader('Content-disposition', 'attachment; filename=report_per_order.csv');
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvString);
    })

    connection.end()
})

app.get('/orderTD/:year', function (req, res) {
    const connection = mysql.createConnection(config)

    connection.connect()

    connection.query(`SELECT nama_penyedia, nama_sumber_dana, kode_order, nama_pelanggan, tgl_order, total_order, status_order, id_order FROM tb_order WHERE YEAR(tgl_order) = ${req.params.year} AND (nama_penyedia LIKE "TD%" OR nama_penyedia = "Tisera Distribusindo") ORDER BY tgl_order`, (err, rows, fields) => {
        if (err) {
            res.status(400).send('Error: terdapat kesalahan pada route.')
        }

        // const csvString = [
        //     [
        //         "ID Order",
        //         "Nama Penyedia",
        //         "Nama Sumber Dana",
        //         "Kode Order",
        //         "Nama Pelanggan",
        //         "Tanggal Order",
        //         "Total Order",
        //         "Status Order"
        //     ],
        //     ...rows.map(row => [
        //         row.id_order, row.nama_penyedia, row.nama_sumber_dana, row.kode_order, row.nama_pelanggan, row.tgl_order.toISOString().replace(/T.+/, ''), row.total_order, row.status_order
        //     ])
        // ].map(e => e.join(" | ")).join("\<br>")
        // res.send(csvString)
        res.status(200).send(rows)
    })

    connection.end()
})

app.get('/orderTD/:year/csv', function (req, res) {
    const connection = mysql.createConnection(config)

    connection.connect()

    connection.query(`SELECT nama_penyedia, nama_sumber_dana, kode_order, nama_pelanggan, tgl_order, total_order, status_order, id_order FROM tb_order WHERE YEAR(tgl_order) = ${req.params.year} AND (nama_penyedia LIKE "%TD%" OR nama_penyedia = "Tisera Distribusindo") ORDER BY tgl_order`, (err, rows, fields) => {
        if (err) {
            res.status(400).send('Error: terdapat kesalahan pada route.')
        }

        const csvString = [
            [
                "ID Order",
                "Nama Penyedia",
                "Nama Sumber Dana",
                "Kode Order",
                "Nama Pelanggan",
                "Tanggal Order",
                "Total Order",
                "Status Order"
            ],
            ...rows.map(row => [
                row.id_order, row.nama_penyedia, row.nama_sumber_dana, row.kode_order, row.nama_pelanggan, row.tgl_order.toISOString().replace(/T.+/, ''), row.total_order, row.status_order
            ])
        ].map(e => e.join(";")).join("\n")

        res.setHeader('Content-disposition', `attachment; filename=report_td_${req.params.year}.csv`);
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvString);
    })

    connection.end()
})

app.get('/orderPID/:year', function (req, res) {
    const connection = mysql.createConnection(config)

    connection.connect()

    connection.query(`SELECT nama_penyedia, nama_sumber_dana, kode_order, nama_pelanggan, tgl_order, total_order, status_order, id_order FROM tb_order WHERE nama_penyedia IN("Padi Indah Digital", "Padi Indah Distribusi") AND YEAR(tgl_order) = ${req.params.year} ORDER BY tgl_order`, (err, rows, fields) => {
        if (err) {
            res.status(400).send('Error: terdapat kesalahan pada route.')
        }

        // const csvString = [
        //     [
        //         "ID Order",
        //         "Nama Penyedia",
        //         "Nama Sumber Dana",
        //         "Kode Order",
        //         "Nama Pelanggan",
        //         "Tanggal Order",
        //         "Total Order",
        //         "Status Order"
        //     ],
        //     ...rows.map(row => [
        //         row.id_order, row.nama_penyedia, row.nama_sumber_dana, row.kode_order, row.nama_pelanggan, row.tgl_order.toISOString().replace(/T.+/, ''), row.total_order, row.status_order
        //     ])
        // ].map(e => e.join(" | ")).join("\<br>")
        // res.send(csvString)
        res.status(200).send(rows)
    })

    connection.end()
})

app.get('/orderPID/:year/csv', function (req, res) {
    const connection = mysql.createConnection(config)

    connection.connect()

    connection.query(`SELECT nama_penyedia, nama_sumber_dana, kode_order, nama_pelanggan, tgl_order, total_order, status_order, id_order FROM tb_order WHERE nama_penyedia IN("Padi Indah Digital", "Padi Indah Distribusi") AND YEAR(tgl_order) = ${req.params.year} ORDER BY tgl_order`, (err, rows, fields) => {
        if (err) {
            res.status(400).send('Error: terdapat kesalahan pada route.')
        }

        const csvString = [
            [
                "ID Order",
                "Nama Penyedia",
                "Nama Sumber Dana",
                "Kode Order",
                "Nama Pelanggan",
                "Tanggal Order",
                "Total Order",
                "Status Order"
            ],
            ...rows.map(row => [
                row.id_order, row.nama_penyedia, row.nama_sumber_dana, row.kode_order, row.nama_pelanggan, row.tgl_order.toISOString().replace(/T.+/, ''), row.total_order, row.status_order
            ])
        ].map(e => e.join(";")).join("\n")

        res.setHeader('Content-disposition', `attachment; filename=report_pid_${req.params.year}.csv`);
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvString);
    })

    connection.end()
})

app.get('/orderAll/:year', function (req, res) {
    const connection = mysql.createConnection(config)

    connection.connect()

    connection.query(`SELECT nama_penyedia, nama_sumber_dana, kode_order, nama_pelanggan, tgl_order, total_order, status_order, id_order FROM tb_order WHERE YEAR(tgl_order) = ${req.params.year} ORDER BY tgl_order`, (err, rows, fields) => {
        if (err) {
            res.status(400).send('Error: terdapat kesalahan pada route.')
        }

        // const csvString = [
        //     [
        //         "ID Order",
        //         "Nama Penyedia",
        //         "Nama Sumber Dana",
        //         "Kode Order",
        //         "Nama Pelanggan",
        //         "Tanggal Order",
        //         "Total Order",
        //         "Status Order"
        //     ],
        //     ...rows.map(row => [
        //         row.id_order, row.nama_penyedia, row.nama_sumber_dana, row.kode_order, row.nama_pelanggan, row.tgl_order.toISOString().replace(/T.+/, ''), row.total_order, row.status_order
        //     ])
        // ].map(e => e.join(" | ")).join("\<br>")
        // res.send(csvString)
        res.status(200).send(rows)
    })

    connection.end()
})

app.get('/orderAll/:year/csv', function (req, res) {
    const connection = mysql.createConnection(config)

    connection.connect()

    connection.query(`SELECT nama_penyedia, nama_sumber_dana, kode_order, nama_pelanggan, tgl_order, total_order, status_order, id_order FROM tb_order WHERE YEAR(tgl_order) = ${req.params.year} ORDER BY tgl_order`, (err, rows, fields) => {
        if (err) {
            res.status(400).send('Error: terdapat kesalahan pada route.')
        }

        const csvString = [
            [
                "ID Order",
                "Nama Penyedia",
                "Nama Sumber Dana",
                "Kode Order",
                "Nama Pelanggan",
                "Tanggal Order",
                "Total Order",
                "Status Order"
            ],
            ...rows.map(row => [
                row.id_order, row.nama_penyedia, row.nama_sumber_dana, row.kode_order, row.nama_pelanggan, row.tgl_order.toISOString().replace(/T.+/, ''), row.total_order, row.status_order
            ])
        ].map(e => e.join(";")).join("\n")

        res.setHeader('Content-disposition', `attachment; filename=report_all_${req.params.year}.csv`);
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csvString);
    })

    connection.end()
})

app.get('*', function(req,res) {
    res.status(400).send('Error: route tidak ditemukan.')
})

app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`);
})