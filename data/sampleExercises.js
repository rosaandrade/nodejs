const sampleExercises = [
  {
    id: 1,
    type: 'Strength',
    text: 'Burpee',
    sets: '4',
    time: '20 reps',
    image: 'https://tse3.mm.bing.net/th?id=OIP.DA2Gm2C6zK__uAe6tuguvwHaEf&pid=Api&P=0&h=180',
    day: 'Monday',
    lastCompleted: null
  },
  {
    id: 2,
    type: 'Cardio',
    text: 'Jumping Jack',
    sets: '4',
    time: '20 reps',
    image: 'https://tse4.mm.bing.net/th?id=OIP.jGMS_unOKe6xYMAOWeh2ygHaFJ&pid=Api&P=0&h=180',
    day: 'Monday',
    lastCompleted: null
  },
  {
    id: 3,
    type: 'Cardio',
    text: 'Butt Kicks',
    sets: '4',
    time: '20 reps',
    image: 'https://tse2.mm.bing.net/th?id=OIP.HFb0CY4Ykww214Z-PCBmHwHaD5&pid=Api&P=0&h=180',
    day: 'Monday',
    lastCompleted: null
  },
  {
    id: 4,
    type: 'Strength',
    text: 'Burpee',
    sets: '4',
    time: '20 reps',
    image: 'https://tse3.mm.bing.net/th?id=OIP.DA2Gm2C6zK__uAe6tuguvwHaEf&pid=Api&P=0&h=180',
    day: 'Monday',
    lastCompleted: null
  },
  {
    id: 5,
    type: 'Strength',
    text: 'Jump Squat',
    sets: '4',
    time: '20 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Aa2bpJJJgTRevrTK31vuHgHaD4&pid=Api&P=0&h=180',
    day: 'Monday',
    lastCompleted: null
  },
  {
    id: 6,
    type: 'Strength',
    text: 'Standing calf raises with weights in hand on a step',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.uuUAm5PjLnMnBdXc7hG_TwHaGz&pid=Api&P=0&h=180',
    day: 'Monday',
    lastCompleted: null
  },
  {
    id: 7,
    type: 'Strength',
    text: 'Sumo squats',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.1H2RXqdttTi2LcRCPGOmDwHaEK&pid=Api&P=0&h=180',
    day: 'Monday',
    lastCompleted: null
  },
  {
    id: 8,
    type: 'Strength',
    text: 'Lunge + goblet squat',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse4.mm.bing.net/th?id=OIP.5E_rZmniqfJhv8cLowyKAgAAAA&pid=Api&P=0&h=180',
    day: 'Monday',
    lastCompleted: null
  },
  {
    id: 9,
    type: 'Strength',
    text: 'Stiff-leg deadlift',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.jKERmP8xc6oWd0mEuiGudgHaEK&pid=Api&P=0&h=180',
    day: 'Monday',
    lastCompleted: null
  },
  {
    id: 10,
    type: 'Strength',
    text: 'Hip thrust with a weight on your stomach while lying on the floor and a mini band above your knees',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse4.mm.bing.net/th?id=OIP.vNEVVDa0l5tBTCugOACa-wHaEa&pid=Api&P=0&h=180',
    day: 'Monday',
    lastCompleted: null
  },
  {
    id: 11,
    type: 'Strength',
    text: 'Donkey kicks (glute kickback on all fours)',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.R3obYaPKk3xJLGULiQiVsAHaHa&pid=Api&P=0&h=180',
    day: 'Monday',
    lastCompleted: null
  },
  {
    id: 12,
    type: 'Cardio',
    text: 'Jumping Jack',
    sets: '4',
    time: '20 reps',
    image: 'https://tse4.mm.bing.net/th?id=OIP.jGMS_unOKe6xYMAOWeh2ygHaFJ&pid=Api&P=0&h=180',
    day: 'Thursday',
    lastCompleted: null
  },
  {
    id: 13,
    type: 'Cardio',
    text: 'Knee Raises to Waist Level',
    sets: '4',
    time: '20 reps',
    image: 'https://tse2.mm.bing.net/th?id=OIP.-O9WDi2tXXuvlAAEHvpO5AHaD4&pid=Api&P=0&h=180',
    day: 'Thursday',
    lastCompleted: null
  },
  {
    id: 14,
    type: 'Cardio',
    text: 'Butt Kicks',
    sets: '4',
    time: '20 reps',
    image: 'https://tse2.mm.bing.net/th?id=OIP.HFb0CY4Ykww214Z-PCBmHwHaD5&pid=Api&P=0&h=180',
    day: 'Thursday',
    lastCompleted: null
  },
  {
    id: 15,
    type: 'Strength',
    text: 'Burpee',
    sets: '4',
    time: '20 reps',
    image: 'https://tse3.mm.bing.net/th?id=OIP.DA2Gm2C6zK__uAe6tuguvwHaEf&pid=Api&P=0&h=180',
    day: 'Thursday',
    lastCompleted: null
  },
  {
    id: 16,
    type: 'Strength',
    text: 'Jump Squat',
    sets: '4',
    time: '20 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Aa2bpJJJgTRevrTK31vuHgHaD4&pid=Api&P=0&h=180',
    day: 'Thursday',
    lastCompleted: null
  },
  {
    id: 17,
    type: 'Strength',
    text: 'One-arm dumbbell row',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.-Th1J4u0sSU5Mzjxia62iAHaHa&pid=Api&P=0&h=180',
    day: 'Thursday',
    lastCompleted: null
  },
  {
    id: 18,
    type: 'Strength',
    text: 'Dumbbell shoulder press',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse4.mm.bing.net/th?id=OIP.cKtmFra1hsBnPeP6rUz_AAHaHa&pid=Api&P=0&h=180',
    day: 'Thursday',
    lastCompleted: null
  },
  {
    id: 19,
    type: 'Strength',
    text: 'Lateral raise',
    sets: '4',
    time: '10–12 reps',
    image: 'https://tse3.mm.bing.net/th?id=OIP.Zq5NQGXJxJNEfR0iSi_RsAHaD4&pid=Api&P=0&h=180',
    day: 'Thursday',
    lastCompleted: null
  },
  {
    id: 20,
    type: 'Strength',
    text: 'Dumbbell pullover',
    sets: '4',
    time: '10–12 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.MaYFmyUxAm3IqyB779dp1wHaDr&pid=Api&P=0&h=180',
    day: 'Thursday',
    lastCompleted: null
  },
  {
    id: 21,
    type: 'Strength',
    text: 'Triceps skull crusher',
    sets: '4',
    time: '10–12 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.muyIuGOLDcH7VLidhe100gHaDt&pid=Api&P=0&h=180',
    day: 'Thursday',
    lastCompleted: null
  },
  {
    id: 22,
    type: 'Strength',
    text: 'Alternating bicep curls',
    sets: '4',
    time: '10–12 reps',
    image: 'https://tse2.mm.bing.net/th?id=OIP.D8iSEOyLmEd3NwW1Pusg5gHaHF&pid=Api&P=0&h=180',
    day: 'Thursday',
    lastCompleted: null
  },
  {
    id: 23,
    type: 'Cardio',
    text: 'Jumping Jack',
    sets: '4',
    time: '20 reps',
    image: 'https://tse4.mm.bing.net/th?id=OIP.jGMS_unOKe6xYMAOWeh2ygHaFJ&pid=Api&P=0&h=180',
    day: 'Tuesday',
    lastCompleted: null
  },
  {
    id: 24,
    type: 'Cardio',
    text: 'Knee Raises to Waist Level',
    sets: '4',
    time: '20 reps',
    image: 'https://tse2.mm.bing.net/th?id=OIP.-O9WDi2tXXuvlAAEHvpO5AHaD4&pid=Api&P=0&h=180',
    day: 'Tuesday',
    lastCompleted: null
  },
  {
    id: 25,
    type: 'Cardio',
    text: 'Butt Kicks',
    sets: '4',
    time: '20 reps',
    image: 'https://tse2.mm.bing.net/th?id=OIP.HFb0CY4Ykww214Z-PCBmHwHaD5&pid=Api&P=0&h=180',
    day: 'Tuesday',
    lastCompleted: null
  },
  {
    id: 26,
    type: 'Strength',
    text: 'Burpee',
    sets: '4',
    time: '20 reps',
    image: 'https://tse3.mm.bing.net/th?id=OIP.DA2Gm2C6zK__uAe6tuguvwHaEf&pid=Api&P=0&h=180',
    day: 'Tuesday',
    lastCompleted: null
  },
  {
    id: 27,
    type: 'Strength',
    text: 'Jump Squat',
    sets: '4',
    time: '20 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Aa2bpJJJgTRevrTK31vuHgHaD4&pid=Api&P=0&h=180',
    day: 'Tuesday',
    lastCompleted: null
  },
  {
    id: 28,
    type: 'Strength',
    text: 'One-arm dumbbell row',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.-Th1J4u0sSU5Mzjxia62iAHaHa&pid=Api&P=0&h=180',
    day: 'Tuesday',
    lastCompleted: null
  },
  {
    id: 29,
    type: 'Strength',
    text: 'Dumbbell shoulder press',
    sets: '4',
    time: '10–12 reps',
    image: 'https://tse4.mm.bing.net/th?id=OIP.cKtmFra1hsBnPeP6rUz_AAHaHa&pid=Api&P=0&h=180',
    day: 'Tuesday',
    lastCompleted: null
  },
  {
    id: 30,
    type: 'Strength',
    text: 'Lateral raise',
    sets: '4',
    time: '10–12 reps',
    image: 'https://tse3.mm.bing.net/th?id=OIP.Zq5NQGXJxJNEfR0iSi_RsAHaD4&pid=Api&P=0&h=180',
    day: 'Tuesday',
    lastCompleted: null
  },
  {
    id: 31,
    type: 'Strength',
    text: 'Dumbbell pullover',
    sets: '4',
    time: '10–12 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.MaYFmyUxAm3IqyB779dp1wHaDr&pid=Api&P=0&h=180',
    day: 'Tuesday',
    lastCompleted: null
  },
  {
    id: 32,
    type: 'Strength',
    text: 'Triceps skull crusher',
    sets: '4',
    time: '10–12 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.muyIuGOLDcH7VLidhe100gHaDt&pid=Api&P=0&h=180',
    day: 'Tuesday',
    lastCompleted: null
  },
  {
    id: 33,
    type: 'Strength',
    text: 'Alternating bicep curls',
    sets: '4',
    time: '10–12 reps',
    image: 'https://tse2.mm.bing.net/th?id=OIP.D8iSEOyLmEd3NwW1Pusg5gHaHF&pid=Api&P=0&h=180',
    day: 'Tuesday',
    lastCompleted: null
  },
  {
    id: 34,
    type: 'Cardio',
    text: 'Jumping Jack',
    sets: '4',
    time: '20 reps',
    image: 'https://tse4.mm.bing.net/th?id=OIP.jGMS_unOKe6xYMAOWeh2ygHaFJ&pid=Api&P=0&h=180',
    day: 'Wednesday',
    lastCompleted: null
  },
  {
    id: 35,
    type: 'Cardio',
    text: 'Knee Raises to Waist Level',
    sets: '4',
    time: '20 reps',
    image: 'https://tse2.mm.bing.net/th?id=OIP.-O9WDi2tXXuvlAAEHvpO5AHaD4&pid=Api&P=0&h=180',
    day: 'Wednesday',
    lastCompleted: null
  },
  {
    id: 36,
    type: 'Cardio',
    text: 'Butt Kicks',
    sets: '4',
    time: '20 reps',
    image: 'https://tse2.mm.bing.net/th?id=OIP.HFb0CY4Ykww214Z-PCBmHwHaD5&pid=Api&P=0&h=180',
    day: 'Wednesday',
    lastCompleted: null
  },
  {
    id: 37,
    type: 'Strength',
    text: 'Burpee',
    sets: '4',
    time: '20 reps',
    image: 'https://tse3.mm.bing.net/th?id=OIP.DA2Gm2C6zK__uAe6tuguvwHaEf&pid=Api&P=0&h=180',
    day: 'Wednesday',
    lastCompleted: null
  },
  {
    id: 38,
    type: 'Strength',
    text: 'Jump Squat',
    sets: '4',
    time: '20 reps',
    image: 'https://tse1.mm.bing.net/th?id=OIP.Aa2bpJJJgTRevrTK31vuHgHaD4&pid=Api&P=0&h=180',
    day: 'Wednesday',
    lastCompleted: null
  },
  {
    id: 39,
    type: 'Strength',
    text: 'Leg abduction with ankle weights',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse4.mm.bing.net/th?id=OIP.5Bpda6PvkDqYhGEzLz8OHAHaEL&pid=Api&P=0&h=180',
    day: 'Wednesday',
    lastCompleted: null
  },
  {
    id: 40,
    type: 'Strength',
    text: 'Goblet squat with dumbbell',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse2.mm.bing.net/th?id=OIP.lMRmhND6uM7s_glRYEGfPgHaFT&pid=Api&P=0&h=180',
    day: 'Wednesday',
    lastCompleted: null
  },
  {
    id: 41,
    type: 'Strength',
    text: 'Seated leg raise with ankle weights',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse2.mm.bing.net/th?id=OIP.6ZZ4A80N9zGLggoRfEbFaAAAAA&pid=Api&P=0&h=180',
    day: 'Wednesday',
    lastCompleted: null
  },
  {
    id: 42,
    type: 'Strength',
    text: 'Stiff-legged deadlift with dumbbell',
    sets: '4',
    time: '12–15 reps',
    image: 'https://tse4.mm.bing.net/th?id=OIP.jS0sdYFZ5mWeQc0kf7hHEAHaHa&pid=Api&P=0&h=180',
    day: 'Wednesday',
    lastCompleted: null
  }

]


module.exports = sampleExercises;

