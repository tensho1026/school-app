import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  // await prisma.admin.createMany({
  //   data: [
  //     { id: "admin1", username: "admin1" },
  //     { id: "admin2", username: "admin2" },
  //   ],
  // });

  // GRADE
  const createdGrades = await Promise.all(
    Array.from({ length: 6 }, (_, i) =>
      prisma.grade.create({ data: { level: i + 1 } })
    )
  );

  // SUBJECT
  const subjectData = [
    "Mathematics", "Science", "English", "History", "Geography", 
    "Physics", "Chemistry", "Biology", "Computer Science", "Art"
  ].map(name => ({ name }));

  const createdSubjects = await prisma.subject.createMany({
    data: subjectData,
    skipDuplicates: true,
  });

  const subjects = await prisma.subject.findMany();

  // TEACHER
  const createdTeachers = await Promise.all(
    Array.from({ length: 15 }, (_, i) =>
      prisma.teacher.create({
        data: {
          id: `teacher${i + 1}`,
          username: `teacher${i + 1}`,
          name: `TName${i + 1}`,
          surname: `TSurname${i + 1}`,
          email: `teacher${i + 1}@example.com`,
          phone: `123-456-789${i + 1}`,
          address: `Address${i + 1}`,
          bloodType: "A+",
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
          subjects: { connect: [{ id: subjects[i % subjects.length].id }] },
        },
      })
    )
  );

  // CLASS
  await Promise.all(
    createdGrades.map((grade, i) =>
      prisma.class.create({
        data: {
          id: i + 1,
          name: `${i + 1}A`,
          gradeId: grade.id,
          capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
          supervisorId: createdTeachers[i % createdTeachers.length].id,
        },
      })
    )
  );

  // PARENT
  const createdParents = await Promise.all(
    Array.from({ length: 25 }, (_, i) =>
      prisma.parent.create({
        data: {
          id: `parentId${i + 1}`,
          username: `parentId${i + 1}`,
          name: `PName ${i + 1}`,
          surname: `PSurname ${i + 1}`,
          email: `parent${i + 1}@example.com`,
          phone: `123-456-789${i + 1}`,
          address: `Address${i + 1}`,
        },
      })
    )
  );

  // STUDENT
  await Promise.all(
    Array.from({ length: 50 }, (_, i) =>
      prisma.student.create({
        data: {
          id: `student${i + 1}`,
          username: `student${i + 1}`,
          name: `SName${i + 1}`,
          surname: `SSurname ${i + 1}`,
          email: `student${i + 1}@example.com`,
          phone: `987-654-321${i + 1}`,
          address: `Address${i + 1}`,
          bloodType: "O-",
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          parentId: createdParents[i % createdParents.length].id,
          gradeId: createdGrades[i % createdGrades.length].id,
          classId: i % 6 + 1,
          birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
        },
      })
    )
  );

  console.log("✅ Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
