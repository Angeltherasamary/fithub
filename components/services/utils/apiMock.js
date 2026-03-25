import exercisesData from "../../../db.json";

export const fetchMock = async (url) => {
  if (!url.startsWith('/api/exercises')) {
    return fetch(url);
  }

  const queryString = url.split('?')[1] || '';
  const searchParams = new URLSearchParams(queryString);
  
  const idSort = searchParams.get('idSort');
  const id = searchParams.get('id');
  const bodyPartsList = searchParams.get('bodyPartsList');
  const target = searchParams.get('target');
  const bodyPart = searchParams.get('bodyPart');
  const equipment = searchParams.get('equipment');

  let data = exercisesData;

  let result;
  if (idSort) {
      const uniqueIds = [
        ...new Map(exercisesData.map(item => [item.id, item])).values()
      ].map(exercise => ({
            id: exercise.id, gifUrl: exercise.gifUrl, bodyPart: exercise.bodyPart,
            equipment: exercise.equipment, name: exercise.name, target: exercise.target,
      }));
      uniqueIds.sort((a, b) => a.id.localeCompare(b.id));
      result = uniqueIds.map((exercise, index) => ({
        ...exercise,
        id: String(index + 1).padStart(4, "0"),
        gifUrl: `https://res.cloudinary.com/devthakur/image/upload/v1686929351/Exercises_Gif/gif_image_${exercise.id}.gif`,
      }));
  } else if (id) {
    const exercise = exercisesData.find((item) => item.id === id);
    if (!exercise) throw new Error("Exercise not found");
    result = exercise;
  } else if (bodyPartsList) {
    result = [...new Set(exercisesData.map((exercise) => exercise.bodyPart))];
  } else {
    if (target) data = data.filter((exercise) => exercise.target === target);
    if (bodyPart && bodyPart !== 'all') data = data.filter((exercise) => exercise.bodyPart === bodyPart);
    if (equipment) data = data.filter((exercise) => exercise.equipment === equipment);
    result = data;
  }

  return {
    json: async () => result,
    ok: true,
    status: 200
  };
};
