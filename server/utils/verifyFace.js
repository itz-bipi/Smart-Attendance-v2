const calculateEuclideanDistance = (
  descriptor1,
  descriptor2
) => {
  if (
    !Array.isArray(descriptor1) ||
    !Array.isArray(descriptor2)
  ) {
    throw new Error("Invalid face descriptor");
  }

  if (descriptor1.length !== descriptor2.length) {
    throw new Error(
      "Face descriptors must have the same length"
    );
  }

  let sum = 0;

  for (let i = 0; i < descriptor1.length; i++) {
    const difference =
      descriptor1[i] - descriptor2[i];

    sum += difference * difference;
  }

  return Math.sqrt(sum);
};

const verifyFace = (
  registeredDescriptor,
  submittedDescriptor
) => {
  const distance = calculateEuclideanDistance(
    registeredDescriptor,
    submittedDescriptor
  );

  // Initial threshold.
  // We'll tune this after testing with real data.
  const threshold = 0.6;

  return {
    verified: distance <= threshold,
    distance,
    threshold,
  };
};

module.exports = verifyFace;