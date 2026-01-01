import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import './Courses.css';

const coursesData = [
    { id: 1, title: 'Complete Python Bootcamp', instructor: 'Dr. Angela Yu', price: 499, originalPrice: 1999, rating: 4.8, image: 'https://placehold.co/400x250/png?text=Python', category: 'Python' },
    { id: 2, title: 'Java Masterclass 2026', instructor: 'Tim Buchalka', price: 599, originalPrice: 2499, rating: 4.7, image: 'https://placehold.co/400x250/png?text=Java', category: 'Java' },
    { id: 3, title: 'React JS - The Complete Guide', instructor: 'Maximilian', price: 699, originalPrice: 2999, rating: 4.9, image: 'https://placehold.co/400x250/png?text=React', category: 'Web Dev' },
    { id: 4, title: 'Flutter & Dart - The Complete Guide', instructor: 'Academind', price: 449, originalPrice: 1999, rating: 4.6, image: 'https://placehold.co/400x250/png?text=Flutter', category: 'App Dev' },
    { id: 5, title: 'Machine Learning A-Z', instructor: 'Kirill Eremenko', price: 999, originalPrice: 4999, rating: 4.8, image: 'https://placehold.co/400x250/png?text=ML+AI', category: 'AI / ML' },
    { id: 6, title: 'UI/UX Design Masterclass', instructor: 'Gary Simon', price: 499, originalPrice: 2499, rating: 4.9, image: 'https://placehold.co/400x250/png?text=Design', category: 'Design' },
];

const categoryMap = {
    'all': 'All',
    'python': 'Python',
    'java': 'Java',
    'web-dev': 'Web Dev',
    'app-dev': 'App Dev',
    'ai-ml': 'AI / ML',
    'design': 'Design'
};

const Courses = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlCategory = searchParams.get('category');

    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        if (urlCategory && categoryMap[urlCategory]) {
            setSelectedCategory(categoryMap[urlCategory]);
        } else {
            setSelectedCategory('All');
        }
    }, [urlCategory]);

    const categories = ['All', 'Python', 'Java', 'Web Dev', 'App Dev', 'AI / ML', 'Design'];

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        const slug = Object.keys(categoryMap).find(key => categoryMap[key] === cat);
        if (slug) {
            setSearchParams({ category: slug });
        } else {
            setSearchParams({});
        }
    };

    const filteredCourses = selectedCategory === 'All'
        ? coursesData
        : coursesData.filter(c => c.category === selectedCategory);

    return (
        <div className="courses-page container">
            <div className="courses-header">
                <h1 className="page-title">All Courses</h1>
                <p className="page-subtitle">Broaden your knowledge with our extensive course library.</p>
            </div>

            <div className="courses-layout">
                {/* Sidebar Filters */}
                <aside className="filters-sidebar">
                    <div className="filter-group">
                        <h3 className="filter-title">Categories</h3>
                        <ul className="filter-list">
                            {categories.map(cat => (
                                <li key={cat}>
                                    <button
                                        className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                                        onClick={() => handleCategoryChange(cat)}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="filter-group">
                        <h3 className="filter-title">Price</h3>
                        <div className="price-range">
                            <label><input type="checkbox" /> Free</label>
                            <label><input type="checkbox" /> Paid</label>
                        </div>
                    </div>
                </aside>

                {/* Courses Grid */}
                <div className="courses-content">
                    <div className="courses-grid">
                        {filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                    {filteredCourses.length === 0 && (
                        <div className="no-results">
                            <p>No courses found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Courses;
