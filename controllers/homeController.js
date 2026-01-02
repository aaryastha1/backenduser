export const getHomeData = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        hero: {
          title: "Deliver You A Blissful Dessert in Every Bite",
          subtitle: "Freshly Baked Goodness",
          description:
            "Each cake is handcrafted with rich flavors and a soft, traditional sponge. Perfect for birthdays, holidays, or everyday moments.",
          images: [
            "/uploads/crosaint.png",
            "/uploads/crossaint.jpg",
            "/uploads/bento.jpg"
          ],
        },

        bestSellers: [
          { name: "White Forest", imageUrl: "/uploads/whiteForest.png" },
          { name: "Tiramisu", imageUrl: "/uploads/Tiramisu.png" },
          { name: "Raspberry Heart", imageUrl: "/uploads/rasberry.png" },
          { name: "Chocolate Chip Cookies", imageUrl: "/uploads/cookies.png" },
          // { name: "Bento", imageUrl: "/uploads/bento.jpg"},
        ],

        customSection: {
          title: "Special Orders",
          description:
            "Create the perfect cake for your celebration with endless customization options.",
          image: "/uploads/homeee.png",
        },

        contact: {
          location: "Kathmandu, Nepal",
          phone: "987-654-3210",
          social: {
            facebook: "https://facebook.com/cakecrumbs",
            instagram: "https://instagram.com/cakecrumbs",
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to load home data" });
  }
};
