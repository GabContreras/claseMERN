import salesModel from '../models/sales.js';


//Array de funciones vacías 

const salesController = {};
salesController.getAllSales = async (req, res) => {
    try {
        const sales = await salesModel.find()
            .sort({ date: -1 });
        res.status(200).json(sales)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Insert 
salesController.createSale = async (req, res) => {
    try {
        const { product, category, customer, total } = req.body;

        if (total < 0) {
            return res.status(400).json({ message: 'El total no puede ser negativo' });
        }

        // Crear nueva venta
        const newSale = new salesModel({
          product, category, customer, total
        });

        await newSale.save();

        res.status(201).json({
            message: 'Venta creada exitosamente',
            sale: newSale
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//===============================
//Ventas que tiene cada categoría
//===============================


salesController.getSalesByCategory = async (req, res) => {
    try {
        const resultado = await salesModel.aggregate(
            [
                {
                    $group: {
                        _id: '$category',
                        totalSales: { $sum: '$total' },
                        salesCount: { $sum: 1 }
                    }
                },
                {
                    $sort: { totalSales: -1 }
                }
            ])


        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//===============================
//Productos más vendidos
//===============================

salesController.getBestSelledProducts = async (req, res) => {
    try {
        const resultado = await salesModel.aggregate(
            [
                {
                    $group: {
                        _id: '$product',
                        totalSales: { $sum: '$total' },
                        salesCount: { $sum: 1 }
                    }
                },
                {
                    $sort: { totalSales: -1 }
                },
                //limitar la cantidad de datos a mostrar
                {
                    $limit: 3
                }
            ])

        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//===============================
//Ganancias totales
//===============================
salesController.getTotalEarnings = async (req, res) => {
    try {
        const resultado = await salesModel.aggregate(
            [
                {
                    $group: {
                        _id: null,
                        totalEarnings: { $sum: '$total' }
                    }
                }
            ])

        if (resultado.length > 0) {
            res.status(200).json({ totalEarnings: resultado[0].totalEarnings });
        } else {
            res.status(200).json({ totalEarnings: 0 });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default salesController;