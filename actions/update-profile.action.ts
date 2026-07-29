"use server"

export default async function updateProfileAction(formData: FormData) {
  const role = formData.get("role")
  const techStack = formData.get("techStack")
  const goals = formData.get("goals")
  const level = formData.get("level")

  
}