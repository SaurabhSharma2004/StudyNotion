const Category = require('../models/Category');


const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: `Please provide all required fields`,
            })
        }

        const category = await Category.create({
            name:name,
            description:description,
        });
        return res.status(201).json({
            success: true,
            message: `Category created successfully`,
            category: category,
        });

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: `Error in creating category`,
            error: error.message,
        });
    }
}

const showAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        return res.status(200).json({
            success: true,
            message: `Categories fetched successfully`,
            data: categories,
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: `Error in fetching categories`,
            error: error.message,
        });
    }
}

const categoryPageDetails = async (req, res) => {
    try {
        const {categoryId} = req.body;
        const selectedCategory = await Category.findById(categoryId).populate(
            {
                path: "courses",
                match:{status:"Published"},
                populate:"ratingAndReviews"
            }
        ).exec();
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: `Category not found`,
            });
        }
        if(selectedCategory.courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No courses found in this category`,
            });
        }

        const categoriesExceptSelected = await Category.find({
            _id:{ $ne: categoryId }
        });

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
        ).populate({
            path:"courses",
            match:{status:"Published"},
        }).exec();

        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
            })
            .exec();
        const allCourses = allCategories.flatMap(category => category.courses)

        const mostSellingCourses = allCourses.sort((a,b) => b.sold - a.sold).slice(0,10);

        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategory,
                mostSellingCourses
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in fetching category page details",
            error:error.message
        })
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = {
    createCategory,
    showAllCategories,
    categoryPageDetails
}