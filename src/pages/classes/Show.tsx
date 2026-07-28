import React from 'react'
import {useShow} from "@refinedev/core";
import {ClassDetails} from "@/types";
import {ShowView, ShowViewHeader} from "@/components/refine-ui/views/show-view.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {AdvancedImage} from "@cloudinary/react"
import {bannerPhoto} from "@/lib/cloudinary.ts";

const ClassShow = () => {

    const {query} = useShow<ClassDetails>({resource: 'classes'})

    const {data, isLoading, isError} = query;

    const classDetails = data?.data;

    if (isLoading || isError || !classDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="classes" title="Class Details"/>

                <p className="state-message">
                    {isLoading ? "Loading class details..." : isError ? "Failed loading class details !" : "Class details not found"}
                </p>
            </ShowView>
        )
    }

    const teacherName = classDetails.teacher?.name ?? "Unknown"
    const teacherInitials = teacherName
        .split('')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent((teacherInitials || "NA"))}`

    const {bannerUrl, name, description, capacity, status, teacher, subject, bannerCldPubId} = classDetails

    return (
        <div className="class-view class-show">
            <ShowViewHeader resource="classes" title="Class Details"/>

            <div className="banner">
                {bannerUrl ? <AdvancedImage alt="classBanner" cldImg={bannerPhoto(bannerCldPubId!, name)}/> :
                    <div className="placeholder"/>}
            </div>

            <Card className="details-card">
                <div className="details-header">
                    <div>
                        <h1>{name}</h1>
                        <p>{description}</p>
                    </div>
                    <div>
                        <Badge variant="outline">{capacity} spots</Badge>
                        <Badge variant={status === 'active' ? 'default' : 'secondary'}
                               data-status={status}>{status.toUpperCase()}</Badge>
                    </div>
                </div>

                <div className="details-grid">
                    <div className="instructor">
                        <p>Instructor</p>
                        <div>
                            <img src={teacher?.image ?? placeholderUrl} alt={teacherName}/>
                            <div>
                                <p>{teacherName}</p>
                                <p>{teacher?.email}</p>
                            </div>
                        </div>
                    </div>


                </div>
                <Separator/>

                <div className="subject">
                    <p>Subject</p>
                    <div className="">
                        <Badge variant="outline">Code: {subject?.code}</Badge>
                        <p>{subject?.name}</p>
                        <p>{subject?.description}</p>
                    </div>
                </div>

                <Separator/>

                <div className="join">
                    <h2>Join Class</h2>
                    <ol>
                        <li>Ask your teacher for the invite code.</li>
                        <li>Click on "join class" button.</li>
                        <li>paste the code and click "join".</li>
                    </ol>
                </div>
                <Button size="lg" className="w-full">Join Class</Button>
            </Card>
        </div>
    )
}
export default ClassShow
