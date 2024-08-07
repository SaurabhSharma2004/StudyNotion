import {useState} from "react";
import  {Pie} from "react-chartjs-2"
import {Chart, registerables} from "chart.js";
Chart.register(...registerables)

const InstructorChart = ({courses}) => {
    const [currentChart, setCurrentChart] = useState("students")
    const getRandomColor = (numColor) => {
        const colors = []
        for (let i = 0; i < numColor; i++) {
            const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
            colors.push(color)
        }
        return colors
    }

    const studentsChartData = {
        labels: courses.map(course => course.courseName),
        datasets: [
            {
                label: "Students",
                data: courses.map(course => course.totalStudentsEnrolled),
                backgroundColor: getRandomColor(courses.length),
                borderColor: getRandomColor(courses.length),
                borderWidth: 1
            }
        ]
    }

    const instructorChartData = {
        labels: courses.map(course => course.courseName),
        datasets: [
            {
                label: "Income",
                data: courses.map(course => course.totalAmountGenerated),
                backgroundColor: getRandomColor(courses.length),
                borderColor: getRandomColor(courses.length),
                borderWidth: 1
            }
        ]
    }

    const options = {}

    return (
        <div>
            <p>Visualise</p>
            <div>
                <button onClick={() => setCurrentChart("students")}>Students</button>
                <button onClick={() => setCurrentChart("income")}>Income</button>
            </div>
            <div>
                <Pie data={currentChart === "students" ? studentsChartData : instructorChartData} options={options} />
            </div>
        </div>
    )
}

export default InstructorChart;