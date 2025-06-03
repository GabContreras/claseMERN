import faqsModel from '../models/Faqs.js';

const faqsController = {};

// Select 
faqsController.getAllFaqs = async (req, res) => {

    try {
        const faqs = await faqsModel.find();
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: 'Error finding FAQs', error });
    }
};

//Insert 
faqsController.insertFaq = async (req, res) => {
    const { question, answer, level, isActive } = req.body;

    try {
        if (!question || !answer || !level || !isActive) {
            return res.status(400).json({ message: 'Ingrese todos los datos requeridos' });
        }
        if (level > 5 || level < 1) {
            return res.status(400).json({ message: 'El nivel debe estar entre 1 y 5' });
        } 
        if (answer.length < 4 || question.length < 4){
            return res.status(400).json({ message: 'La respuesta y la pregunta deben tener al menos 4 caracteres' });
        }
        const newFaq = new faqsModel({ question, answer, level, isActive });
        newFaq.save();
        res.status(200).json({ message: "Faq saved" });
    } catch (error) {
        res.status(500).json({ message: 'Error saving FAQ', error });
    }
};

//Actualizar

faqsController.updateFaqs = async (req, res) => {

    try {
        const { question, answer, level, isActive } = req.body;

        //Validacion
        if (level > 5 || level < 1) {
            return res.status(400).json({ message: 'El nivel debe estar entre 1 y 5' });
        }
        //Actualizar los campos
        const updatedFaq = await faqsModel.findByIdAndUpdate(
            req.params.id,
            { question, answer, level, isActive },
            { new: true }
        );

        if (!updatedFaq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        res.status(200).json({ message: 'FAQ updated successfully', updatedFaq });
    } catch (error) {
        console.error("error"+ error);
        res.status(500).json({ message: 'Error updating FAQ', error });
    }


}

faqsController.deleteFaqs = async (req, res) => {
    try {
        const deletedFaq = await faqsModel.findByIdAndDelete(req.params.id);

        if (!deletedFaq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        res.status(200).json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        console.log("error"+ error);
        res.status(500).json({ message: 'Error deleting FAQ', error });
    }
}

export default faqsController;